from typing import Optional
from pydantic import BaseModel


class UploadPaperResponse(BaseModel):
    paper_id: str
    job_id: str
    title: str
    status: str
    cloudinary_url: Optional[str] = None
    message: str


class RemoteImportRequest(BaseModel):
    source: str  # "arxiv" | "pubmed" | "doi" | "semantic_scholar"
    identifier: str
