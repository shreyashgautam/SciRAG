import uuid


def generate_id(prefix: str = "id") -> str:
    return f"{prefix}_{uuid.uuid4().hex[:12]}"


def generate_user_id() -> str:
    return generate_id("usr")


def generate_paper_id() -> str:
    return generate_id("paper")


def generate_chunk_id(paper_id: str, index: int) -> str:
    return f"chk_{paper_id[:8]}_{index:04d}"


def generate_job_id() -> str:
    return generate_id("job")


def generate_conversation_id() -> str:
    return generate_id("conv")


def generate_message_id() -> str:
    return generate_id("msg")


def generate_citation_id() -> str:
    return generate_id("cite")


def generate_eval_id() -> str:
    return generate_id("eval")
