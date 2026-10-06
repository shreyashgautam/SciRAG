from typing import Any, Dict, List, Optional
from app.retrieval.hybrid import hybrid_retrieve
from app.rag.context_builder import build_evidence_context
from app.rag.citation_grounder import ground_and_validate_citations
from app.rag.prompts import SYSTEM_RAG_PROMPT
from app.services.grok_service import grok_service
from app.core.config import settings


async def run_controlled_deep_research(
    query: str,
    owner_id: str,
    paper_ids: Optional[List[str]] = None,
    max_iterations: int = settings.MAX_AGENT_ITERATIONS
) -> Dict[str, Any]:
    """
    Controlled agentic deep research:
    Iteration 1: Initial hybrid retrieve & initial evaluation
    Iteration 2: Formulate gap-focused query & retrieve supplementary evidence
    Iteration 3: Synthesize consolidated cross-paper response
    Enforces strict max iteration boundary to prevent infinite loops.
    """
    accumulated_candidates: List[Dict[str, Any]] = []
    seen_chunk_ids = set()
    steps: List[Dict[str, Any]] = []
    current_query = query

    for iteration in range(1, min(max_iterations, 3) + 1):
        candidates = await hybrid_retrieve(
            query=current_query,
            owner_id=owner_id,
            paper_ids=paper_ids,
            top_k=5
        )

        new_count = 0
        for c in candidates:
            cid = str(c.get("_id") or c.get("id"))
            if cid not in seen_chunk_ids:
                seen_chunk_ids.add(cid)
                accumulated_candidates.append(c)
                new_count += 1

        steps.append({
            "iteration": iteration,
            "query": current_query,
            "retrieved_count": new_count,
            "decision": "Cross-checking evidence" if iteration < max_iterations else "Synthesizing final findings"
        })

        if iteration < max_iterations:
            # Generate next query
            brief_summaries = " ".join([c.get("text", "")[:100] for c in candidates[:3]])
            current_query = await grok_service.generate_followup_query(query, brief_summaries)

    # Final synthesis on accumulated evidence
    formatted_context, source_mapping = build_evidence_context(accumulated_candidates[:8])
    raw_answer = await grok_service.generate_answer(
        system_prompt=SYSTEM_RAG_PROMPT,
        user_query=query,
        formatted_context=formatted_context
    )
    final_answer, citations = ground_and_validate_citations(raw_answer, source_mapping)

    return {
        "query": query,
        "steps": steps,
        "final_answer": final_answer,
        "citations": citations,
        "sources_count": len(accumulated_candidates)
    }
