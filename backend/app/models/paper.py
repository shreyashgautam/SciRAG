from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AuthorModel(BaseModel):
    name: str
    affiliation: Optional[str] = None
    orcid: Optional[str] = None


class PaperSectionModel(BaseModel):
    id: str
    title: str
    page: int
    content: str


class PaperSummaryModel(BaseModel):
    tldr: str
    research_problem: str
    key_contribution: str
    methodology: str
    dataset: str
    results: str
    limitations: str
    future_work: str


class PaperModel(BaseModel):
    id: str = Field(alias="_id")
    owner_id: str
    title: str
    authors: List[AuthorModel] = Field(default_factory=list)
    abstract: str
    year: int = 2024
    venue: str = "Preprint / ArXiv"
    doi: Optional[str] = None
    source: str = "pdf"  # "arxiv" | "pdf" | "pubmed" | "semantic_scholar"
    source_url: Optional[str] = None
    cloudinary_public_id: Optional[str] = None
    cloudinary_url: Optional[str] = None
    page_count: int = 1
    sections: List[PaperSectionModel] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    collection_ids: List[str] = Field(default_factory=list)
    status: str = "uploaded"  # uploaded, parsing, section_detection, chunking, embedding, indexing, ready, failed
    processing_progress: int = 0
    chunk_count: int = 0
    file_size: Optional[str] = None
    is_favorite: bool = False
    summary: Optional[PaperSummaryModel] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_opened_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
