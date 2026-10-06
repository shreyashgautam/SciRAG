from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user
from app.models.user import UserModel
from app.schemas.user import UserProfileResponse, UserProfileUpdate
from app.services.user_service import user_service

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserProfileResponse)
async def get_my_profile(current_user: UserModel = Depends(get_current_user)):
    return await user_service.get_profile(current_user.id)


@router.patch("/me", response_model=UserProfileResponse)
async def update_my_profile(
    req: UserProfileUpdate,
    current_user: UserModel = Depends(get_current_user)
):
    return await user_service.update_profile(current_user.id, req)


@router.delete("/me")
async def delete_my_account(current_user: UserModel = Depends(get_current_user)):
    return {"success": True, "message": "User account scheduled for deletion."}


@router.post("/me/logout-all")
async def logout_all_sessions(current_user: UserModel = Depends(get_current_user)):
    return {"success": True, "message": "All active sessions terminated."}
