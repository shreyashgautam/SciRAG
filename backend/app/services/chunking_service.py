from typing import Any, Dict, List
from app.core.config import settings
from app.models.chunk import ChunkModel
from app.utils.ids import generate_chunk_id
from app.utils.text import estimate_token_count


class ChunkingService:
    def __init__(self, chunk_size: int = settings.CHUNK_SIZE, chunk_overlap: int = settings.CHUNK_OVERLAP):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_paper(
        self,
        paper_id: str,
        owner_id: str,
        sections: List[Dict[str, Any]],
        paper_metadata: Dict[str, Any]
    ) -> List[ChunkModel]:
        """
        Segment paper sections into semantic chunks preserving section boundaries and page numbers.
        """
        chunks: List[ChunkModel] = []
        global_chunk_index = 0

        for section in sections:
            sec_title = section.get("title", "Unknown")
            sec_page = section.get("page", 1)
            sec_content = section.get("content", "").strip()

            if not sec_content:
                continue

            # Split section text into paragraphs or sentences
            paragraphs = [p.strip() for p in sec_content.split("\n\n") if p.strip()]
            if not paragraphs:
                paragraphs = [sec_content]

            current_chunk_words: List[str] = []
            current_tokens = 0

            for para in paragraphs:
                words = para.split()
                para_tokens = estimate_token_count(para)

                # If adding this paragraph exceeds target chunk size and we already have content:
                if current_tokens + para_tokens > self.chunk_size and current_tokens >= 150:
                    chunk_text = " ".join(current_chunk_words)
                    chunk_id = generate_chunk_id(paper_id, global_chunk_index)
                    chunks.append(
                        ChunkModel(
                            _id=chunk_id,
                            paper_id=paper_id,
                            owner_id=owner_id,
                            section=sec_title,
                            page_number=sec_page,
                            chunk_index=global_chunk_index,
                            text=chunk_text,
                            token_count=current_tokens,
                            metadata={
                                "paper_title": paper_metadata.get("title", ""),
                                "authors": paper_metadata.get("authors_str", ""),
                                "year": paper_metadata.get("year", 2024),
                                "venue": paper_metadata.get("venue", ""),
                                "source": paper_metadata.get("source", "pdf"),
                                "section": sec_title,
                                "page": sec_page,
                            }
                        )
                    )
                    global_chunk_index += 1

                    # Retain overlap words
                    overlap_word_count = max(10, int(self.chunk_overlap * 0.75))
                    current_chunk_words = current_chunk_words[-overlap_word_count:] + words
                    current_tokens = estimate_token_count(" ".join(current_chunk_words))
                else:
                    current_chunk_words.extend(words)
                    current_tokens += para_tokens

            # Flush remaining words in section
            if current_chunk_words:
                chunk_text = " ".join(current_chunk_words)
                if len(chunk_text.strip()) > 30:
                    chunk_id = generate_chunk_id(paper_id, global_chunk_index)
                    chunks.append(
                        ChunkModel(
                            _id=chunk_id,
                            paper_id=paper_id,
                            owner_id=owner_id,
                            section=sec_title,
                            page_number=sec_page,
                            chunk_index=global_chunk_index,
                            text=chunk_text,
                            token_count=estimate_token_count(chunk_text),
                            metadata={
                                "paper_title": paper_metadata.get("title", ""),
                                "authors": paper_metadata.get("authors_str", ""),
                                "year": paper_metadata.get("year", 2024),
                                "venue": paper_metadata.get("venue", ""),
                                "source": paper_metadata.get("source", "pdf"),
                                "section": sec_title,
                                "page": sec_page,
                            }
                        )
                    )
                    global_chunk_index += 1

        return chunks


chunking_service = ChunkingService()
