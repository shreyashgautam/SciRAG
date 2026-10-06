from typing import Any, Dict, Optional
from app.core.config import settings
from app.core.logging import logger

try:
    import cloudinary
    import cloudinary.uploader
    import cloudinary.utils
    CLOUDINARY_AVAILABLE = True
except ImportError:
    CLOUDINARY_AVAILABLE = False


class CloudinaryService:
    def __init__(self):
        self.is_configured = False
        if (
            CLOUDINARY_AVAILABLE
            and settings.CLOUDINARY_CLOUD_NAME
            and settings.CLOUDINARY_API_KEY
            and settings.CLOUDINARY_API_SECRET
        ):
            cloudinary.config(
                cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                api_key=settings.CLOUDINARY_API_KEY,
                api_secret=settings.CLOUDINARY_API_SECRET,
                secure=True
            )
            self.is_configured = True
            logger.info("Cloudinary PDF storage configured.")
        else:
            logger.info("Cloudinary unconfigured; running in local storage abstraction.")

    async def upload_pdf(self, pdf_bytes: bytes, filename: str, user_id: str) -> Dict[str, Any]:
        """
        Upload scientific PDF to secure folder in Cloudinary.
        """
        folder = f"{settings.CLOUDINARY_UPLOAD_FOLDER}/{user_id}"
        if self.is_configured:
            try:
                res = cloudinary.uploader.upload(
                    pdf_bytes,
                    resource_type="raw",
                    folder=folder,
                    public_id=f"doc_{filename.replace('.pdf', '')}",
                    overwrite=True
                )
                return {
                    "public_id": res.get("public_id"),
                    "secure_url": res.get("secure_url"),
                    "bytes": res.get("bytes", len(pdf_bytes)),
                    "format": "pdf"
                }
            except Exception as e:
                logger.error(f"Cloudinary upload failed: {e}")

        # Local abstraction fallback
        return {
            "public_id": f"{folder}/{filename}",
            "secure_url": f"/static/uploads/{user_id}/{filename}",
            "bytes": len(pdf_bytes),
            "format": "pdf"
        }

    async def delete_pdf(self, public_id: str) -> bool:
        """Delete PDF asset from Cloudinary to prevent orphaned storage."""
        if self.is_configured and public_id:
            try:
                cloudinary.uploader.destroy(public_id, resource_type="raw")
                return True
            except Exception as e:
                logger.error(f"Cloudinary deletion failed: {e}")
                return False
        return True


cloudinary_service = CloudinaryService()
