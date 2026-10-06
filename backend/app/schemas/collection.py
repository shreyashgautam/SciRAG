from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class CollectionCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = ""
    paper_ids: List[str] = Field(default_factory=list)


class CollectionUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    paper_ids: Optional[List[str]] = None


class CollectionResponse(BaseModel):
    id: str
    owner_id: str
    name: str
    description: str
    paper_ids: List[str]
    paper_count: int
    created_at: datetime
    updated_at: datetime
