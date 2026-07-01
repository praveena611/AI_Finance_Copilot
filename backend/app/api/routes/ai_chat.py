from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os

from app.database.database import get_db
from app.services.finance_context_service import build_finance_context
from app.services.gemini_service import generate_finance_response
from app.services.prompt_builder import build_prompt

router = APIRouter()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

print("GEMINI KEY EXISTS:", bool(GOOGLE_API_KEY))


class ChatRequest(BaseModel):
    message: str


@router.post("/ai/chat")
def chat_with_ai(
    req: ChatRequest,
    db: Session = Depends(get_db),
):

    if not GOOGLE_API_KEY:
        return {
            "reply": "❌ GOOGLE_API_KEY not found."
        }

    # -----------------------------------------
    # Build complete finance context
    # -----------------------------------------

    context = build_finance_context(db)

    # -----------------------------------------
    # Prompt
    # -----------------------------------------

    prompt = build_prompt(
        context=context,
        user_message=req.message
    )

    reply = generate_finance_response(prompt)

    return {
        "reply": reply
    }