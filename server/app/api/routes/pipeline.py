from fastapi import APIRouter

router = APIRouter()

@router.post("/process")
async def process_pipeline():
    """Process exam through grading pipeline"""
    return {"message": "Process pipeline endpoint"}

@router.get("/status/{pipeline_id}")
async def get_pipeline_status(pipeline_id: str):
    """Get pipeline execution status"""
    return {"message": f"Get pipeline status {pipeline_id} endpoint"}
