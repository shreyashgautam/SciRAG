from typing import Any, Dict, List
from app.core.config import settings
from app.core.logging import logger

_cross_encoder_instance = None


class Reranker:
    """
    Cross-Encoder Reranker layer.
    Scores (query, passage) pairs to maximize precision before LLM injection.
    """
    def __init__(self, model_name: str = settings.RERANKER_MODEL):
        self.model_name = model_name
        self.model = None
        self._init_model()

    def _init_model(self):
        global _cross_encoder_instance
        try:
            from sentence_transformers import CrossEncoder
            if _cross_encoder_instance is None:
                logger.info(f"Loading CrossEncoder reranker: {self.model_name}")
                _cross_encoder_instance = CrossEncoder(self.model_name, max_length=512)
            self.model = _cross_encoder_instance
        except Exception as e:
            logger.info(f"CrossEncoder bypassed ({e}); running score-preserving reranker fallback.")
            self.model = None

    def rerank(
        self,
        query: str,
        candidates: List[Dict[str, Any]],
        top_k: int = settings.TOP_K_RERANK
    ) -> List[Dict[str, Any]]:
        """
        Rerank retrieved candidates based on cross-encoder logit scores.
        """
        if not candidates:
            return []

        if self.model is not None:
            try:
                pairs = [[query, c.get("text", "")] for c in candidates]
                scores = self.model.predict(pairs)
                for i, score in enumerate(scores):
                    # Sigmoid normalization
                    candidates[i]["rerank_score"] = float(1.0 / (1.0 + 2.71828 ** (-float(score))))
                candidates.sort(key=lambda x: x.get("rerank_score", 0), reverse=True)
                return candidates[:top_k]
            except Exception as e:
                logger.warning(f"CrossEncoder prediction error: {e}")

        # Fallback heuristic: word overlap & fusion score
        q_words = set(query.lower().split())
        for c in candidates:
            t_words = set(c.get("text", "").lower().split())
            overlap = len(q_words.intersection(t_words)) / max(1, len(q_words))
            base_score = float(c.get("score", 0.5))
            c["rerank_score"] = float(min(1.0, base_score * 0.6 + overlap * 0.4))

        candidates.sort(key=lambda x: x.get("rerank_score", 0), reverse=True)
        return candidates[:top_k]


reranker = Reranker()
