from datetime import datetime, timezone
from typing import Any, Dict, Optional
from app.db.mongodb import get_database
from app.models.user import UserModel
from app.schemas.user import UserProfileUpdate, UserProfileResponse
from app.core.exceptions import ResourceNotFoundError
from app.services.auth_service import auth_service


class UserService:
    async def get_profile(self, user_id: str) -> UserProfileResponse:
        user = await auth_service.get_user_by_id(user_id)
        if not user:
            raise ResourceNotFoundError("User", user_id)
        return UserProfileResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            avatar_url=user.avatar_url,
            role=user.role,
            research_interests=user.research_interests,
            is_verified=user.is_verified,
            created_at=user.created_at,
            last_login_at=user.last_login_at
        )

    async def update_profile(self, user_id: str, req: UserProfileUpdate) -> UserProfileResponse:
        db = get_database()
        update_fields: Dict[str, Any] = {"updated_at": datetime.now(timezone.utc)}
        if req.name is not None:
            update_fields["name"] = req.name
        if req.avatar_url is not None:
            update_fields["avatar_url"] = req.avatar_url
        if req.research_interests is not None:
            update_fields["research_interests"] = req.research_interests

        if db is not None:
            await db.users.update_one({"_id": user_id}, {"$set": update_fields})

        return await self.get_profile(user_id)


user_service = UserService()
