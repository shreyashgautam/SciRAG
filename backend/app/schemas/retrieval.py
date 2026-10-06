from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class RetrievalRequest(BaseModel):
    query: str
    paper_ids: Optional[List[str]] = None
    collection_id: Optional[str] = None
    top_k: int = 10


class RerankRequest(BaseModel):
    query: str
    candidates: List[Dict[str, Any]]
    top_k: int = 5
