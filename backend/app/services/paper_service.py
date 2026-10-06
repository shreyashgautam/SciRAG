from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from app.db.mongodb import get_database
from app.models.paper import PaperModel
from app.schemas.paper import PaperResponse, PaperUpdateRequest
from app.core.exceptions import ResourceNotFoundError, AuthorizationError
from app.services.cloudinary_service import cloudinary_service

# In-memory papers cache when MongoDB runs in offline dev mode
_memory_papers: Dict[str, Dict[str, Any]] = {}


class PaperService:
    async def list_papers(self, owner_id: str) -> List[PaperResponse]:
        db = get_database()
        if db is not None:
            cursor = db.papers.find({"owner_id": owner_id}).sort("created_at", -1)
            docs = await cursor.to_list(length=100)
            return [PaperResponse(**d) for d in docs]

        docs = [p for p in _memory_papers.values() if p.get("owner_id") == owner_id]
        return [PaperResponse(**d) for d in docs]

    async def get_paper(self, paper_id: str, owner_id: str) -> PaperResponse:
        db = get_database()
        doc = None
        if db is not None:
            doc = await db.papers.find_one({"_id": paper_id})
        else:
            doc = _memory_papers.get(paper_id)

        if not doc:
            raise ResourceNotFoundError("Paper", paper_id)

        # Enforce strict cross-user isolation
        if doc.get("owner_id") != owner_id:
            raise AuthorizationError("Access denied: You do not own this research paper.")

        # Update last opened timestamp
        now = datetime.now(timezone.utc)
        if db is not None:
            await db.papers.update_one({"_id": paper_id}, {"$set": {"last_opened_at": now}})
        else:
            doc["last_opened_at"] = now

        return PaperResponse(**doc)

    async def update_paper(self, paper_id: str, owner_id: str, req: PaperUpdateRequest) -> PaperResponse:
        await self.get_paper(paper_id, owner_id)
        db = get_database()
        fields: Dict[str, Any] = {"updated_at": datetime.now(timezone.utc)}
        if req.title is not None:
            fields["title"] = req.title
        if req.tags is not None:
            fields["tags"] = req.tags
        if req.is_favorite is not None:
            fields["is_favorite"] = req.is_favorite
        if req.collection_ids is not None:
            fields["collection_ids"] = req.collection_ids

        if db is not None:
            await db.papers.update_one({"_id": paper_id}, {"$set": fields})
        elif paper_id in _memory_papers:
            _memory_papers[paper_id].update(fields)

        return await self.get_paper(paper_id, owner_id)

    async def delete_paper(self, paper_id: str, owner_id: str) -> bool:
        paper = await self.get_paper(paper_id, owner_id)
        db = get_database()

        # 1. Delete Cloudinary asset
        if paper.source_url and "cloudinary" in paper.source_url:
            await cloudinary_service.delete_pdf(f"scirag/papers/{owner_id}/{paper_id}")

        if db is not None:
            # 2. Delete paper metadata
            await db.papers.delete_one({"_id": paper_id, "owner_id": owner_id})
            # 3. Delete chunks (crucial for vector space cleanup)
            await db.chunks.delete_many({"paper_id": paper_id, "owner_id": owner_id})
            # 4. Delete citations
            await db.citations.delete_many({"paper_id": paper_id})
            # 5. Remove references from collections
            await db.collections.update_many(
                {"owner_id": owner_id},
                {"$pull": {"paper_ids": paper_id}}
            )
            # 6. Delete associated jobs
            await db.research_jobs.delete_many({"paper_id": paper_id})
        else:
            _memory_papers.pop(paper_id, None)

        return True

    async def get_sections(self, paper_id: str, owner_id: str) -> List[Dict[str, Any]]:
        paper = await self.get_paper(paper_id, owner_id)
        return [s.model_dump() for s in paper.sections]

    async def get_chunks(self, paper_id: str, owner_id: str) -> List[Dict[str, Any]]:
        await self.get_paper(paper_id, owner_id)
        db = get_database()
        if db is not None:
            cursor = db.chunks.find({"paper_id": paper_id, "owner_id": owner_id}).sort("chunk_index", 1)
            return await cursor.to_list(length=500)
        return []


paper_service = PaperService()
