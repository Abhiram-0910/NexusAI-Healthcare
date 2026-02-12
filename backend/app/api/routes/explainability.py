from fastapi import APIRouter

router = APIRouter()

@router.get("/explain")
def explain():
    return {"explanation": "heatmap"}
