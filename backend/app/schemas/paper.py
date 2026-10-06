from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AuthorSchema(BaseModel):
    name: str
    affiliation: Optional[str] = None
    orcid: Optional[str] = None


class PaperSectionSchema(BaseModel):
    id: str
    title: str
    page: int
    content: str


class PaperSummarySchema(BaseModel):
    tldr: str
    research_problem: str
    key_contribution: str
    methodology: str
    dataset: str
    results: str
    limitations: str
    future_work: str


class PaperResponse(BaseModel):
    id: str
    owner_id: str
    title: str
    authors: List[AuthorSchema]
    abstract: str
    year: int
    venue: str
    doi: Optional[str] = None
    source: str
    source_url: Optional[str] = None
    cloudinary_url: Optional[str] = None
    page_count: int
    sections: List[PaperSectionSchema] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    collection_ids: List[str] = Field(default_factory=list)
    status: str
    processing_progress: int
    chunk_count: int
    file_size: Optional[str] = None
    is_favorite: bool
    summary: Optional[PaperSummarySchema] = None
    created_at: datetime
    last_opened_at: Optional[datetime] = None


class PaperUpdateRequest(BaseModel):
    title: Optional[str] = None
    tags: Optional[List[str]] = None
    is_favorite: Optional[bool] = None
    collection_ids: Optional[List[str]] = None
