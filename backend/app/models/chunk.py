from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ChunkModel(BaseModel):
    id: str = Field(alias="_id")
    paper_id: str
    owner_id: str
    section: str = "Unknown"
    page_number: int = 1
    chunk_index: int = 0
    text: str
    token_count: int = 0
    embedding: Optional[List[float]] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
