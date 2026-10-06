from typing import Any, Dict, List
from fastapi import APIRouter, Depends, status
from app.api.dependencies import get_current_user
from app.models.user import UserModel
from app.schemas.paper import PaperResponse, PaperUpdateRequest
from app.services.paper_service import paper_service

router = APIRouter(prefix="/papers", tags=["Papers"])


@router.get("", response_model=List[PaperResponse])
async def list_papers(current_user: UserModel = Depends(get_current_user)):
    """List all research papers owned by authenticated researcher."""
    return await paper_service.list_papers(current_user.id)


@router.get("/{paper_id}", response_model=PaperResponse)
async def get_paper(paper_id: str, current_user: UserModel = Depends(get_current_user)):
    """Retrieve detailed metadata for a specific paper."""
    return await paper_service.get_paper(paper_id, current_user.id)


@router.patch("/{paper_id}", response_model=PaperResponse)
async def update_paper(
    paper_id: str,
    req: PaperUpdateRequest,
    current_user: UserModel = Depends(get_current_user)
):
    """Update paper metadata, tags, or favorite flag."""
    return await paper_service.update_paper(paper_id, current_user.id, req)


@router.delete("/{paper_id}")
async def delete_paper(paper_id: str, current_user: UserModel = Depends(get_current_user)):
    """Cascade delete paper, chunks, citations, and Cloudinary storage."""
    await paper_service.delete_paper(paper_id, current_user.id)
    return {"success": True, "message": f"Paper {paper_id} and associated chunks deleted."}


@router.get("/{paper_id}/sections")
async def get_paper_sections(paper_id: str, current_user: UserModel = Depends(get_current_user)):
    """Retrieve parsed scientific sections for viewer table of contents."""
    return await paper_service.get_sections(paper_id, current_user.id)


@router.get("/{paper_id}/chunks")
async def get_paper_chunks(paper_id: str, current_user: UserModel = Depends(get_current_user)):
    """Retrieve vector chunks partitioned for this paper."""
    return await paper_service.get_chunks(paper_id, current_user.id)
