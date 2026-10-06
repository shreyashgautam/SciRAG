import asyncio
from datetime import datetime, timezone
from typing import Any, Dict, List
from app.db.mongodb import get_database
from app.ingestion.pdf_processor import PDFProcessor
from app.services.chunking_service import chunking_service
from app.embeddings.embedder import embed_documents
from app.services.cloudinary_service import cloudinary_service
from app.services.grok_service import grok_service
from app.models.research_job import ResearchJobModel
from app.core.logging import logger

pdf_processor = PDFProcessor()


class IngestionService:
    async def process_paper_pipeline(
        self,
        paper_id: str,
        owner_id: str,
        pdf_bytes: bytes,
        filename: str,
        job_id: str
    ):
        """
        Orchestrate complete scientific ingestion:
        PDF -> Cloudinary -> Parser -> Section Detector -> Semantic Chunking -> Embeddings -> Ready
        """
        db = get_database()

        async def update_status(stage: str, progress: int, status: str = "in_progress", err: str = None):
            now = datetime.now(timezone.utc)
            if db is not None:
                await db.research_jobs.update_one(
                    {"_id": job_id},
                    {"$set": {"stage": stage, "progress": progress, "status": status, "error": err, "updated_at": now}}
                )
                await db.papers.update_one(
                    {"_id": paper_id},
                    {"$set": {"status": stage, "processing_progress": progress, "updated_at": now}}
                )

        try:
            # 1. Cloudinary upload
            await update_status("uploaded", 10)
            upload_res = await cloudinary_service.upload_pdf(pdf_bytes, filename, owner_id)

            # 2. PDF Parsing & Structure Extraction
            await update_status("parsing", 30)
            parsed = pdf_processor.extract_document(pdf_bytes)
            sections = parsed.get("sections", [])
            meta = parsed.get("metadata", {})
            page_count = meta.get("page_count", len(parsed.get("pages", [1])))
            title = meta.get("title") or filename.replace(".pdf", "").replace("_", " ").title()

            # 3. Section Detection & Verification
            await update_status("section_detection", 50)
            if not sections:
                sections = [{
                    "id": "sec-1",
                    "title": "Abstract & Main Body",
                    "page": 1,
                    "content": parsed.get("raw_text", "")
                }]

            # 4. Semantic Chunking (300-500 tokens target)
            await update_status("chunking", 70)
            paper_meta_dict = {
                "title": title,
                "authors_str": meta.get("author", "Researcher"),
                "year": 2024,
                "venue": "Scientific Document Index",
                "source": "pdf"
            }
            chunks = chunking_service.chunk_paper(
                paper_id=paper_id,
                owner_id=owner_id,
                sections=sections,
                paper_metadata=paper_meta_dict
            )

            # 5. Embedding Generation (BGE / E5)
            await update_status("embedding", 85)
            chunk_texts = [c.text for c in chunks]
            embeddings = embed_documents(chunk_texts)
            for i, emb in enumerate(embeddings):
                chunks[i].embedding = emb

            # 6. Generate AI Summary
            await update_status("indexing", 95)
            summary_dict = await grok_service.generate_summary(
                paper_title=title,
                full_or_section_text=sections[0]["content"] if sections else parsed.get("raw_text", "")
            )

            # 7. Persist to MongoDB
            now = datetime.now(timezone.utc)
            paper_doc = {
                "_id": paper_id,
                "owner_id": owner_id,
                "title": title,
                "authors": [{"name": meta.get("author", "Researcher")}],
                "abstract": sections[0]["content"][:600] if sections else "Scientific paper",
                "year": 2024,
                "venue": "Peer-Reviewed Literature",
                "source": "pdf",
                "source_url": upload_res.get("secure_url"),
                "cloudinary_public_id": upload_res.get("public_id"),
                "cloudinary_url": upload_res.get("secure_url"),
                "page_count": page_count,
                "sections": sections,
                "tags": ["PDF Upload", "Indexed"],
                "collection_ids": [],
                "status": "ready",
                "processing_progress": 100,
                "chunk_count": len(chunks),
                "file_size": f"{len(pdf_bytes)/(1024*1024):.1f} MB",
                "is_favorite": False,
                "summary": summary_dict,
                "created_at": now,
                "updated_at": now,
                "last_opened_at": now
            }

            if db is not None:
                await db.papers.update_one({"_id": paper_id}, {"$set": paper_doc}, upsert=True)
                # Bulk insert chunks
                if chunks:
                    chunk_dicts = [c.model_dump(by_alias=True) for c in chunks]
                    await db.chunks.insert_many(chunk_dicts)

            await update_status("ready", 100, status="completed")
            logger.info(f"Successfully ingested paper '{title}' with {len(chunks)} chunks.")

        except Exception as e:
            logger.error(f"Ingestion failed for paper {paper_id}: {e}")
            await update_status("failed", 0, status="failed", err=str(e))


ingestion_service = IngestionService()
