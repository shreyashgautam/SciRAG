from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field


class ResearchJobModel(BaseModel):
    id: str = Field(alias="_id")
    paper_id: str
    user_id: str
    stage: str = "uploaded"  # uploaded, parsing, section_detection, chunking, embedding, indexing, ready, failed
    progress: int = 0
    status: str = "pending"  # pending, in_progress, completed, failed
    error: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
