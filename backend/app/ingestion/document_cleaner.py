import re
from typing import List
from app.utils.text import clean_scientific_text


def clean_page_lines(lines: List[str]) -> List[str]:
    """
    Remove running headers, page numbers, and copyright footers from page lines.
    """
    cleaned: List[str] = []
    for line in lines:
        stripped = line.strip()
        # Filter standalone numbers (page numbers)
        if stripped.isdigit() and len(stripped) <= 4:
            continue
        # Filter standard arXiv banner footers
        if re.search(r'arXiv:\d{4}\.\d{4,5}', stripped, re.IGNORECASE) and len(stripped) < 40:
            continue
        # Filter standard copyright footers
        if re.search(r'copyright\s+\d{4}|all rights reserved', stripped, re.IGNORECASE) and len(stripped) < 60:
            continue
        cleaned.append(line)
    return cleaned


def clean_document_text(text: str) -> str:
    return clean_scientific_text(text)
