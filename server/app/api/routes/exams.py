from fastapi import APIRouter

router = APIRouter()

@router.post("/upload")
async def upload_exam():
    """Upload exam PDFs"""
    return {"message": "Upload exam endpoint"}

@router.get("/")
async def list_exams():
    """List all exams"""
    return {"message": "List exams endpoint"}

@router.get("/{exam_id}")
async def get_exam(exam_id: str):
    """Get exam details"""
    return {"message": f"Get exam {exam_id} endpoint"}
