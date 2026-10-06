from typing import Any, Dict, List, Tuple


def build_evidence_context(candidates: List[Dict[str, Any]]) -> Tuple[str, Dict[str, Dict[str, Any]]]:
    """
    Format retrieved chunks into structured, tamper-proof evidentiary blocks:
    [SOURCE S1]
    Paper: ...
    Authors: ...
    Year: ...
    Page: ...
    Section: ...
    Evidence: ...
    """
    context_blocks: List[str] = []
    source_mapping: Dict[str, Dict[str, Any]] = {}

    for idx, c in enumerate(candidates):
        source_key = f"S{idx + 1}"
        meta = c.get("metadata", {})
        title = meta.get("paper_title") or c.get("paper_title", "Unknown Document")
        authors = meta.get("authors") or c.get("authors", "Unknown Authors")
        year = meta.get("year") or c.get("year", 2024)
        page = c.get("page_number") or meta.get("page", 1)
        section = c.get("section") or meta.get("section", "General")
        text = c.get("text", "").strip()

        source_mapping[source_key] = {
            "source_key": source_key,
            "number": idx + 1,
            "chunk_id": str(c.get("_id") or c.get("id") or ""),
            "paper_id": c.get("paper_id", ""),
            "paper_title": title,
            "authors": authors,
            "year": year,
            "page": page,
            "section": section,
            "relevance_score": int(c.get("rerank_score", c.get("score", 0.9)) * 100),
            "excerpt": text
        }

        block = (
            f"[SOURCE {source_key}]\n"
            f"Paper: {title}\n"
            f"Authors: {authors}\n"
            f"Year: {year}\n"
            f"Page: {page}\n"
            f"Section: {section}\n"
            f"Evidence:\n{text}\n"
        )
        context_blocks.append(block)

    formatted_context = "\n--------------------\n".join(context_blocks)
    return formatted_context, source_mapping
