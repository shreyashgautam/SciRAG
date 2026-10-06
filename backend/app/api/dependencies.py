from typing import Optional
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_token
from app.models.user import UserModel
from app.services.auth_service import auth_service
from app.core.exceptions import AuthenticationError, AuthorizationError

security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)
) -> UserModel:
    """
    Validate JWT Bearer Token and return authenticated user model.
    """
    if not credentials or not credentials.credentials:
        raise AuthenticationError("Authentication required: Missing Bearer token.")

    token = credentials.credentials
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise AuthenticationError("Invalid or expired authentication token.")

    user_id = payload.get("sub")
    if not user_id:
        raise AuthenticationError("Malformed token payload.")

    user = await auth_service.get_user_by_id(user_id)
    if not user:
        raise AuthenticationError("User account not found or deactivated.")

    return user


async def require_user(current_user: UserModel = Depends(get_current_user)) -> UserModel:
    return current_user


async def require_admin(current_user: UserModel = Depends(get_current_user)) -> UserModel:
    if current_user.role != "admin":
        raise AuthorizationError("Administrator privileges required.")
    return current_user
