from typing import Any, Dict, Optional
from fastapi import HTTPException, status


class SciRAGException(Exception):
    def __init__(self, message: str, code: str = "INTERNAL_ERROR", details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.details = details or {}


class AuthenticationError(HTTPException):
    def __init__(self, detail: str = "Invalid credentials or expired authentication session"):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail, headers={"WWW-Authenticate": "Bearer"})


class AuthorizationError(HTTPException):
    def __init__(self, detail: str = "Permission denied: unauthorized resource access"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class ResourceNotFoundError(HTTPException):
    def __init__(self, resource: str = "Resource", resource_id: str = ""):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource} {resource_id} not found or does not belong to user.",
        )


class RateLimitExceededError(HTTPException):
    def __init__(self, detail: str = "Rate limit exceeded. Please back off before retrying."):
        super().__init__(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=detail)


class ServiceUnavailableError(HTTPException):
    def __init__(self, service: str = "External Service"):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"{service} is currently unconfigured or unreachable.",
        )
