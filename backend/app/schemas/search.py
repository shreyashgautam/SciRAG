from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    query: str
    paper_ids: Optional[List[str]] = None
    collection_id: Optional[str] = None
    mode: str = "hybrid"  # "semantic" | "keyword" | "hybrid"
    top_k: int = 10


class SearchResultItem(BaseModel):
    chunk_id: str
    paper_id: str
    paper_title: str
    authors: str
    year: int
    page: int
    section: str
    text: str
    score: float
    retrieval_method: str = "hybrid"


class SearchResponse(BaseModel):
    query: str
    mode: str
    total_found: int
    results: List[SearchResultItem]
