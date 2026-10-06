from datetime import datetime, timezone
from typing import List
from pydantic import BaseModel, Field


class ConversationModel(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    title: str = "New Research Inquiry"
    scope_paper_ids: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
