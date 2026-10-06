from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class MessageModel(BaseModel):
    id: str = Field(alias="_id")
    conversation_id: str
    user_id: str
    role: str  # "user" | "assistant"
    content: str
    citations: List[Dict[str, Any]] = Field(default_factory=list)
    retrieved_chunk_ids: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
