from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field


class CitationModel(BaseModel):
    id: str = Field(alias="_id")
    number: int
    paper_id: str
    paper_title: str
    authors: str
    year: int
    page: int
    section: str
    relevance_score: int
    excerpt: str
    verification_status: str = "verified"
    chunk_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
