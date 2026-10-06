from typing import Optional
from pydantic import BaseModel


class CitationResponse(BaseModel):
    id: str
    number: int
    paper_id: str
    paper_title: str
    authors: str
    year: int
    page: int
    section: str
    relevance_score: int
    excerpt: str
    verification_status: str
    chunk_id: Optional[str] = None
