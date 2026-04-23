from fastapi import APIRouter

router = APIRouter()

@router.post("/create")
async def create_rubric():
    """Create a rubric"""
    return {"message": "Create rubric endpoint"}

@router.get("/")
async def list_rubrics():
    """List all rubrics"""
    return {"message": "List rubrics endpoint"}

@router.get("/{rubric_id}")
async def get_rubric(rubric_id: str):
    """Get rubric details"""
    return {"message": f"Get rubric {rubric_id} endpoint"}
