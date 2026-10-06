from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr


class UserProfileResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    avatar_url: Optional[str] = None
    role: str
    research_interests: List[str]
    is_verified: bool
    created_at: datetime
    last_login_at: Optional[datetime] = None


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    research_interests: Optional[List[str]] = None
