from typing import Any, Dict, List, Optional
import io
from app.ingestion.section_detector import detect_section_header
from app.ingestion.document_cleaner import clean_page_lines, clean_document_text
from app.core.logging import logger

try:
    import fitz  # PyMuPDF
    PYMUPDF_AVAILABLE = True
except ImportError:
    PYMUPDF_AVAILABLE = False
    logger.warning("PyMuPDF (fitz) not installed. Operating with pure text parser fallback.")


class PDFProcessor:
    """
    Scientific PDF Parser extracting pages, metadata, and sections.
    """
    def __init__(self):
        pass

    def extract_document(self, pdf_bytes: bytes) -> Dict[str, Any]:
        """
        Extract page text, detected sections, and basic metadata.
        """
        if PYMUPDF_AVAILABLE:
            return self._extract_with_fitz(pdf_bytes)
        else:
            return self._extract_fallback(pdf_bytes)

    def _extract_with_fitz(self, pdf_bytes: bytes) -> Dict[str, Any]:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        total_pages = len(doc)

        metadata = {
            "title": doc.metadata.get("title", "") if doc.metadata else "",
            "author": doc.metadata.get("author", "") if doc.metadata else "",
            "page_count": total_pages
        }

        pages_data: List[Dict[str, Any]] = []
        sections_map: Dict[str, Dict[str, Any]] = {}
        current_section = "Abstract"

        for page_idx in range(total_pages):
            page_num = page_idx + 1
            page = doc[page_idx]
            raw_text = page.get_text("text")

            lines = raw_text.splitlines()
            cleaned_lines = clean_page_lines(lines)

            page_section_content: List[str] = []

            for line in cleaned_lines:
                detected = detect_section_header(line)
                if detected:
                    # Switch section
                    current_section = detected
                    if current_section not in sections_map:
                        sections_map[current_section] = {
                            "id": f"sec-{len(sections_map)+1}",
                            "title": current_section,
                            "page": page_num,
                            "content": ""
                        }
                else:
                    if current_section not in sections_map:
                        sections_map[current_section] = {
                            "id": f"sec-{len(sections_map)+1}",
                            "title": current_section,
                            "page": page_num,
                            "content": ""
                        }
                    sections_map[current_section]["content"] += " " + line.strip()

                page_section_content.append(line)

            page_cleaned_text = clean_document_text("\n".join(page_section_content))
            pages_data.append({
                "page_number": page_num,
                "text": page_cleaned_text
            })

        sections_list = [
            {
                "id": data["id"],
                "title": data["title"],
                "page": data["page"],
                "content": clean_document_text(data["content"])
            }
            for data in sections_map.values()
            if len(data["content"].strip()) > 20
        ]

        # Extract title from first page if not in metadata
        if not metadata["title"] and pages_data:
            first_lines = pages_data[0]["text"].split("\n")
            for fl in first_lines[:5]:
                if len(fl.strip()) > 15:
                    metadata["title"] = fl.strip()
                    break

        return {
            "metadata": metadata,
            "pages": pages_data,
            "sections": sections_list,
            "raw_text": "\n\n".join([p["text"] for p in pages_data])
        }

    def _extract_fallback(self, pdf_bytes: bytes) -> Dict[str, Any]:
        """Simple plain text extraction fallback when fitz is unavailable."""
        # Attempt simple latin-1 / utf-8 text extraction from binary stream
        try:
            text = pdf_bytes.decode("utf-8", errors="ignore")
        except Exception:
            text = "Scientific PDF Document"

        clean_text = clean_document_text(text[:5000])
        return {
            "metadata": {"title": "Uploaded Scientific Paper", "author": "Researcher", "page_count": 1},
            "pages": [{"page_number": 1, "text": clean_text}],
            "sections": [{"id": "sec-1", "title": "Main Text", "page": 1, "content": clean_text}],
            "raw_text": clean_text
        }
