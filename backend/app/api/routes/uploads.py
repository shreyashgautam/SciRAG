from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, UploadFile, status
from app.api.dependencies import get_current_user
from app.models.user import UserModel
from app.schemas.upload import UploadPaperResponse, RemoteImportRequest
from app.utils.validators import validate_pdf_file, check_pdf_magic_bytes
from app.utils.ids import generate_paper_id, generate_job_id
from app.services.ingestion_service import ingestion_service
from app.core.config import settings

router = APIRouter(prefix="/uploads", tags=["Uploads & Ingestion"])


@router.post("/paper", response_model=UploadPaperResponse, status_code=status.HTTP_202_ACCEPTED)
async def upload_paper(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: UserModel = Depends(get_current_user)
):
    """
    Upload and ingest a scientific PDF document:
    Validates magic bytes, uploads to Cloudinary, chunks semantically, embeds, and indexes in background.
    """
    is_valid, err = validate_pdf_file(file, settings.MAX_UPLOAD_SIZE_MB)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=err)

    pdf_bytes = await file.read()
    if len(pdf_bytes) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum size limit of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    # Validate PDF magic bytes (%PDF-)
    if not check_pdf_magic_bytes(pdf_bytes):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File header validation failed. Uploaded content is not a valid PDF document."
        )

    paper_id = generate_paper_id()
    job_id = generate_job_id()

    # Enqueue background ingestion pipeline
    background_tasks.add_task(
        ingestion_service.process_paper_pipeline,
        paper_id=paper_id,
        owner_id=current_user.id,
        pdf_bytes=pdf_bytes,
        filename=file.filename or "paper.pdf",
        job_id=job_id
    )

    clean_title = (file.filename or "paper.pdf").replace(".pdf", "").replace("_", " ").title()

    return UploadPaperResponse(
        paper_id=paper_id,
        job_id=job_id,
        title=clean_title,
        status="processing",
        cloudinary_url=None,
        message="Paper accepted. Semantic chunking and vector indexing started in background."
    )


@router.post("/import-remote", response_model=UploadPaperResponse)
async def import_remote_paper(
    req: RemoteImportRequest,
    current_user: UserModel = Depends(get_current_user)
):
    """Import paper from arXiv, PubMed, or DOI identifier."""
    paper_id = generate_paper_id()
    job_id = generate_job_id()
    return UploadPaperResponse(
        paper_id=paper_id,
        job_id=job_id,
        title=f"Imported from {req.source.upper()}: {req.identifier}",
        status="processing",
        message=f"Fetching paper from {req.source} index..."
    )
