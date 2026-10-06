from datetime import datetime, timezone
from typing import Any, Dict, Optional
from app.db.mongodb import get_database
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from app.models.user import UserModel
from app.schemas.auth import UserRegisterRequest, TokenResponse
from app.utils.ids import generate_user_id
from app.core.exceptions import AuthenticationError
from app.core.config import settings

# In-memory user fallback store when MongoDB is in offline dev mode
_memory_users: Dict[str, Dict[str, Any]] = {
    "e.rostova@scirag.io": {
        "_id": "usr-researcher-01",
        "name": "Dr. Elena Rostova",
        "email": "e.rostova@scirag.io",
        "password_hash": get_password_hash("password123"),
        "role": "admin",
        "research_interests": ["Retrieval-Augmented Generation", "Vector Indices", "Hallucination Mitigation"],
        "is_verified": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "last_login_at": datetime.now(timezone.utc),
    }
}


class AuthService:
    async def register(self, req: UserRegisterRequest) -> TokenResponse:
        db = get_database()
        user_id = generate_user_id()
        hashed = get_password_hash(req.password)
        now = datetime.now(timezone.utc)

        user_doc = {
            "_id": user_id,
            "name": req.name,
            "email": req.email.lower(),
            "password_hash": hashed,
            "role": "user",
            "research_interests": req.research_interests,
            "is_verified": True,
            "created_at": now,
            "updated_at": now,
            "last_login_at": now,
        }

        if db is not None:
            existing = await db.users.find_one({"email": req.email.lower()})
            if existing:
                raise AuthenticationError("An account with this email address already exists.")
            await db.users.insert_one(user_doc)
        else:
            if req.email.lower() in _memory_users:
                raise AuthenticationError("An account with this email address already exists.")
            _memory_users[req.email.lower()] = user_doc

        token_data = {"sub": user_id, "email": req.email.lower(), "role": "user"}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )

    async def authenticate(self, email: str, password: str) -> TokenResponse:
        db = get_database()
        email_clean = email.lower().strip()
        user = None

        if db is not None:
            user = await db.users.find_one({"email": email_clean})
        else:
            user = _memory_users.get(email_clean)

        if not user or not verify_password(password, user["password_hash"]):
            raise AuthenticationError("Invalid academic email or password.")

        # Update last login
        now = datetime.now(timezone.utc)
        if db is not None:
            await db.users.update_one({"_id": user["_id"]}, {"$set": {"last_login_at": now}})
        else:
            user["last_login_at"] = now

        token_data = {"sub": user["_id"], "email": user["email"], "role": user.get("role", "user")}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )

    async def get_user_by_id(self, user_id: str) -> Optional[UserModel]:
        db = get_database()
        if db is not None:
            doc = await db.users.find_one({"_id": user_id})
            if doc:
                return UserModel(**doc)
            return None

        for u in _memory_users.values():
            if u["_id"] == user_id:
                return UserModel(**u)
        return None


auth_service = AuthService()
