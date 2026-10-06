from typing import Any, Dict, Optional
import httpx
from app.core.config import settings
from app.core.logging import logger


class GrobidClient:
    """
    GROBID-compatible scientific PDF parser abstraction layer.
    """
    def __init__(self, base_url: Optional[str] = None):
        self.base_url = base_url or settings.GROBID_URL

    async def is_available(self) -> bool:
        if not self.base_url:
            return False
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(f"{self.base_url}/api/isalive")
                return res.status_code == 200
        except Exception:
            return False

    async def process_fulltext_document(self, pdf_bytes: bytes) -> Optional[Dict[str, Any]]:
        """
        Send PDF to GROBID TEI fulltext processing service if available.
        """
        if not await self.is_available():
            logger.info("GROBID service unavailable; falling back to local PyMuPDF extraction.")
            return None

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                files = {"input": ("document.pdf", pdf_bytes, "application/pdf")}
                res = await client.post(f"{self.base_url}/api/processFulltextDocument", files=files)
                if res.status_code == 200:
                    return {"tei_xml": res.text, "status": "success"}
                return None
        except Exception as e:
            logger.warning(f"GROBID processing failed: {e}")
            return None
