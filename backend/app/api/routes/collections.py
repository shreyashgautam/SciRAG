from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user
from app.models.user import UserModel
from app.schemas.collection import CollectionCreateRequest, CollectionResponse, CollectionUpdateRequest
from app.db.mongodb import get_database
from app.utils.ids import generate_id
from app.core.exceptions import ResourceNotFoundError

router = APIRouter(prefix="/collections", tags=["Collections"])


@router.get("", response_model=List[CollectionResponse])
async def list_collections(current_user: UserModel = Depends(get_current_user)):
    db = get_database()
    if db is not None:
        cursor = db.collections.find({"owner_id": current_user.id}).sort("created_at", -1)
        docs = await cursor.to_list(length=100)
        return [
            CollectionResponse(
                id=d["_id"],
                owner_id=d["owner_id"],
                name=d["name"],
                description=d.get("description", ""),
                paper_ids=d.get("paper_ids", []),
                paper_count=len(d.get("paper_ids", [])),
                created_at=d["created_at"],
                updated_at=d["updated_at"]
            )
            for d in docs
        ]
    return []


@router.post("", response_model=CollectionResponse)
async def create_collection(
    req: CollectionCreateRequest,
    current_user: UserModel = Depends(get_current_user)
):
    col_id = generate_id("col")
    now = datetime.now(timezone.utc)
    doc = {
        "_id": col_id,
        "owner_id": current_user.id,
        "name": req.name,
        "description": req.description,
        "paper_ids": req.paper_ids,
        "created_at": now,
        "updated_at": now
    }
    db = get_database()
    if db is not None:
        await db.collections.insert_one(doc)

    return CollectionResponse(
        id=col_id,
        owner_id=current_user.id,
        name=req.name,
        description=req.description,
        paper_ids=req.paper_ids,
        paper_count=len(req.paper_ids),
        created_at=now,
        updated_at=now
    )


@router.delete("/{collection_id}")
async def delete_collection(collection_id: str, current_user: UserModel = Depends(get_current_user)):
    db = get_database()
    if db is not None:
        await db.collections.delete_one({"_id": collection_id, "owner_id": current_user.id})
    return {"success": True, "message": "Collection deleted."}
