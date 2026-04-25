"""
Grading pipeline management routes.

Endpoints:
- POST /pipeline/process/{submission_id} - Process submission through grading pipeline
- GET /pipeline/status/{pipeline_id} - Get pipeline execution status
- GET /pipeline/history/{exam_id} - Get pipeline execution history for exam
"""

import logging
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.supabase import get_db_session
from app.models import Submission, SubmissionStatus, Exam
from app.services import GradeService, AnswerRegionService
from app.schemas import SubmissionResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/pipeline", tags=["pipeline"])

# Simple in-memory pipeline status tracking (replace with database in production)
pipeline_status_cache = {}


@router.post(
    "/process/{submission_id}",
    response_model=dict,
    status_code=status.HTTP_202_ACCEPTED,
)
def process_submission_pipeline(
    submission_id: str,
    db: Session = Depends(get_db_session)
):
    """
    Process a submission through the grading pipeline.
    
    This is a stub endpoint. The actual LangGraph pipeline integration
    should be implemented here.
    
    Args:
        submission_id: Submission UUID
        db: Database session
        
    Returns:
        Pipeline job info with status URL
    """
    try:
        from uuid import UUID
        submission_uuid = UUID(submission_id)
        
        # Verify submission exists
        submission = db.query(Submission).filter(
            Submission.id == submission_uuid
        ).first()
        
        if not submission:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Submission {submission_id} not found"
            )
        
        # Create pipeline job ID
        job_id = str(uuid.uuid4())
        
        # Update submission status
        submission.status = SubmissionStatus.PROCESSING.value
        db.commit()
        
        # Store pipeline status
        pipeline_status_cache[job_id] = {
            "id": job_id,
            "submission_id": str(submission_uuid),
            "status": "processing",
            "progress": 0,
            "started_at": datetime.utcnow().isoformat(),
            "completed_at": None,
            "error": None
        }
        
        logger.info(f"Started pipeline processing for submission: {submission_id}")
        
        return {
            "job_id": job_id,
            "submission_id": str(submission_uuid),
            "status": "processing",
            "status_url": f"/api/pipeline/status/{job_id}"
        }
        
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid submission ID format"
        )
    except Exception as e:
        logger.error(f"Error starting pipeline: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to start pipeline processing"
        )


@router.get(
    "/status/{pipeline_id}",
    response_model=dict,
)
def get_pipeline_status(
    pipeline_id: str,
    db: Session = Depends(get_db_session)
):
    """
    Get pipeline execution status.
    
    Args:
        pipeline_id: Pipeline job UUID
        db: Database session
        
    Returns:
        Pipeline status information
    """
    try:
        status_info = pipeline_status_cache.get(pipeline_id)
        
        if not status_info:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Pipeline job {pipeline_id} not found"
            )
        
        return status_info
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting pipeline status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get pipeline status"
        )


@router.get(
    "/history/{exam_id}",
    response_model=dict,
)
def get_pipeline_history(
    exam_id: str,
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db_session)
):
    """
    Get pipeline execution history for an exam.
    
    Args:
        exam_id: Exam UUID
        limit: Number of results to return
        offset: Pagination offset
        db: Database session
        
    Returns:
        Pipeline history with statistics
    """
    try:
        from uuid import UUID
        exam_uuid = UUID(exam_id)
        
        # Verify exam exists
        exam = db.query(Exam).filter(Exam.id == exam_uuid).first()
        if not exam:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Exam {exam_id} not found"
            )
        
        # Get submissions for exam
        submissions = db.query(Submission).filter(
            Submission.exam_id == exam_uuid
        ).order_by(Submission.created_at.desc()).all()
        
        # Build history from submissions
        total = len(submissions)
        paginated = submissions[offset : offset + limit]
        
        history = [
            {
                "submission_id": str(s.id),
                "student_name": s.student_name,
                "status": s.status,
                "created_at": s.created_at.isoformat() if s.created_at else None,
                "grade_count": len(GradeService.get_grades_by_exam(db, s.id))
                if s.id else 0
            }
            for s in paginated
        ]
        
        return {
            "exam_id": str(exam_uuid),
            "history": history,
            "total": total,
            "limit": limit,
            "offset": offset
        }
        
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid exam ID format"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting pipeline history: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get pipeline history"
        )
