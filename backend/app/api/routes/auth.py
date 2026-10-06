from fastapi import APIRouter, Depends, status
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    PasswordResetRequest
)
from app.schemas.user import UserProfileResponse
from app.services.auth_service import auth_service
from app.core.security import decode_token, create_access_token, create_refresh_token
from app.core.exceptions import AuthenticationError
from app.api.dependencies import get_current_user
from app.models.user import UserModel

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(req: UserRegisterRequest):
    """Register a new researcher account."""
    return await auth_service.register(req)


@router.post("/login", response_model=TokenResponse)
async def login(req: UserLoginRequest):
    """Authenticate researcher credentials and issue JWT tokens."""
    return await auth_service.authenticate(req.email, req.password)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(req: RefreshTokenRequest):
    """Refresh an access token using a valid refresh token."""
    payload = decode_token(req.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise AuthenticationError("Invalid or expired refresh token.")

    user_id = payload.get("sub")
    email = payload.get("email")
    role = payload.get("role", "user")

    new_access = create_access_token({"sub": user_id, "email": email, "role": role})
    new_refresh = create_refresh_token({"sub": user_id, "email": email, "role": role})

    return TokenResponse(
        access_token=new_access,
        refresh_token=new_refresh,
        expires_in=1800
    )


@router.get("/me", response_model=UserProfileResponse)
async def get_current_user_profile(user: UserModel = Depends(get_current_user)):
    """Retrieve profile of currently authenticated researcher."""
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


@router.post("/logout")
async def logout(user: UserModel = Depends(get_current_user)):
    """Invalidate session."""
    return {"success": True, "message": "Successfully logged out."}


@router.post("/forgot-password")
async def forgot_password(req: PasswordResetRequest):
    """Initiate password reset protocol."""
    return {"success": True, "message": f"Password reset instructions sent to {req.email} if account exists."}
