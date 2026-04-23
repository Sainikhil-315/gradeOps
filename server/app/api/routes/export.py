from fastapi import APIRouter

router = APIRouter()

@router.post("/csv")
async def export_csv():
    """Export grades as CSV"""
    return {"message": "Export CSV endpoint"}

@router.post("/excel")
async def export_excel():
    """Export grades as Excel"""
    return {"message": "Export Excel endpoint"}
