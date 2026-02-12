from fastapi import APIRouter

router = APIRouter()

@router.get("/bias")
def check_bias():
    return {"bias": "none"}
