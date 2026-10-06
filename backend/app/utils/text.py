import re
from typing import List


def estimate_token_count(text: str) -> int:
    """Rough estimation of token count (~0.75 words per token or ~4 chars per token)."""
    if not text:
        return 0
    words = text.split()
    return max(1, int(len(words) * 1.33))


def clean_scientific_text(raw_text: str) -> str:
    """
    Clean raw extracted PDF text:
    - Normalizes strange unicode ligatures (fi, fl, ffi)
    - Strips recurring running headers/footers
    - Collapses excessive linebreaks and whitespace
    """
    if not raw_text:
        return ""

    # Replace ligatures
    text = raw_text.replace("\ufb01", "fi").replace("\ufb02", "fl").replace("\ufb03", "ffi")

    # Fix hyphens across linebreaks (e.g. "retriev-\nal" -> "retrieval")
    text = re.sub(r'(\w+)-\n(\w+)', r'\1\2', text)

    # Collapse multiple blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Collapse multiple horizontal spaces
    text = re.sub(r'[ \t]{2,}', ' ', text)

    return text.strip()
