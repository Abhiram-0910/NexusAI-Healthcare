from fastapi import APIRouter

router = APIRouter()

@router.post("/diagnose")
def diagnose():
    return {"status": "diagnosed"}
