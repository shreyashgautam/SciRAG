from app.services.grok_service import grok_service


async def maybe_rewrite_query(query: str, enable_rewrite: bool = False) -> str:
    """
    Conditionally rewrite queries only when useful (e.g. conversational question to keyword/dense search prompt).
    """
    clean_q = query.strip()
    if not enable_rewrite or len(clean_q.split()) <= 2:
        return clean_q

    # Don't rewrite queries that are already structured scientific inquiries
    if clean_q.startswith("How does") or clean_q.startswith("What is") or clean_q.startswith("Why is"):
        return clean_q

    return await grok_service.rewrite_query(clean_q)
