from datetime import datetime, timezone
from typing import List
from pydantic import BaseModel, Field


class CollectionModel(BaseModel):
    id: str = Field(alias="_id")
    owner_id: str
    name: str
    description: str = ""
    paper_ids: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
