import logging
from typing import List, Optional

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

from app.core.config import settings
from app.pipeline.state import GradeState

logger = logging.getLogger(__name__)

# Global model instance, loaded lazily
_model: Optional[SentenceTransformer] = None


def get_embedding_model() -> Optional[SentenceTransformer]:
    """Lazily load the SentenceTransformer model."""
    global _model
    if _model is None:
        try:
            logger.info(f"Loading embedding model: {settings.EMBEDDING_MODEL} (First time loading might take a few minutes to download...)")
            _model = SentenceTransformer(settings.EMBEDDING_MODEL)
            logger.info("✓ Embedding model loaded successfully")
        except Exception as e:
            logger.error(f"Could not load embedding model '{settings.EMBEDDING_MODEL}': {e}")
            return None
    return _model


def plagiarism_node(state: GradeState) -> GradeState:
    """
    Computes embedding for the answer and checks against other submissions
    for potential plagiarism.
    """
    # Initialize defaults
    state["embedding"] = []
    state["similar_submission_ids"] = []
    state["plagiarism_flag"] = False

    if state.get("needs_manual_review"):
        return state

    model = get_embedding_model()
    if not model:
        logger.warning("Plagiarism detection skipped: Model not available.")
        return state

    try:
        text = state.get("cleaned_text", "")
        if not text:
            return state

        embedding = model.encode(text).tolist()
        state["embedding"] = embedding
        
        similar_submission_ids: List[str] = []
        all_embeddings = state.get("all_embeddings", [])

        for stored in all_embeddings:
            vector = stored.get("vector")
            region_id = stored.get("answer_region_id")
            
            if not vector or not region_id:
                continue
                
            # Compute cosine similarity
            sim = cosine_similarity([embedding], [vector])[0][0]
            if sim >= settings.PLAGIARISM_THRESHOLD:
                similar_submission_ids.append(region_id)

        state["similar_submission_ids"] = similar_submission_ids
        state["plagiarism_flag"] = len(similar_submission_ids) > 0
        
    except Exception as e:
        logger.error(f"Error during plagiarism detection: {e}")
        # We don't want to fail the whole pipeline just because plagiarism check failed
        
    return state
