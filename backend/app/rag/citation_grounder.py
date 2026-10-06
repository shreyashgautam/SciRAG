import re
from typing import Any, Dict, List, Tuple


def ground_and_validate_citations(
    raw_answer: str,
    source_mapping: Dict[str, Dict[str, Any]]
) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Parse [S1], [S2] or [1], [2] citations from generated answer.
    Enforce that citations reference real, retrieved evidentiary passages.
    Normalizes inline citations into standard [1], [2] format.
    """
    grounded_citations: List[Dict[str, Any]] = []
    used_keys = set()

    # Find all [S1], [S2] or [1], [2] patterns
    matches = re.findall(r'\[(S?\d+)\]', raw_answer)

    normalized_answer = raw_answer

    for match in matches:
        # Canonical key: S1, S2 or convert 1 -> S1
        canonical_key = match if match.startswith("S") else f"S{match}"

        if canonical_key in source_mapping:
            source_info = source_mapping[canonical_key]
            num = source_info["number"]
            # Replace [S1] with [1] in text for clean user display
            normalized_answer = re.sub(
                rf'\[{match}\]',
                f'[{num}]',
                normalized_answer
            )
            if canonical_key not in used_keys:
                used_keys.add(canonical_key)
                grounded_citations.append({
                    "id": f"cite-{source_info['paper_id']}-{num}",
                    "number": num,
                    "paper_id": source_info["paper_id"],
                    "paper_title": source_info["paper_title"],
                    "authors": source_info["authors"],
                    "year": source_info["year"],
                    "page": source_info["page"],
                    "section": source_info["section"],
                    "relevance_score": source_info["relevance_score"],
                    "excerpt": source_info["excerpt"],
                    "chunk_id": source_info["chunk_id"],
                    "verification_status": "verified"
                })
        else:
            # Hallucinated citation: remove phantom citation tag to prevent misinformation
            normalized_answer = re.sub(rf'\[{match}\]', '', normalized_answer)

    # Sort citations by number [1], [2]
    grounded_citations.sort(key=lambda x: x["number"])

    return normalized_answer.strip(), grounded_citations
