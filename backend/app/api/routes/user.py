from fastapi import APIRouter

router = APIRouter()

# 🧠 Temporary user profile (replace with DB later)
@router.get("/user/profile")
def get_user_profile():
    return {
        "name": "Praveena",
        "income": 50000,
        "currency": "INR"
    }