from typing import Tuple
from fastapi import UploadFile


def validate_pdf_file(file: UploadFile, max_size_mb: int = 25) -> Tuple[bool, str]:
    """
    Validate that an uploaded file is a valid PDF via magic bytes and size check.
    """
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        return False, "Invalid file extension. Only .pdf files are accepted."

    # Validate MIME type
    if file.content_type and "pdf" not in file.content_type.lower() and file.content_type != "application/octet-stream":
        return False, f"Invalid MIME type: {file.content_type}. Expected application/pdf."

    return True, ""


def check_pdf_magic_bytes(header_bytes: bytes) -> bool:
    """Check for PDF magic header '%PDF-' in first 1024 bytes."""
    return b"%PDF-" in header_bytes[:1024]
