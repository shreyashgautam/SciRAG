from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field


class UserModel(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: str
    password_hash: str
    avatar_url: Optional[str] = None
    research_interests: List[str] = Field(default_factory=list)
    role: str = "user"  # "user" | "admin"
    is_verified: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_login_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
