import os
import shutil

from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.ai.gemini_receipt import analyze_receipt
from app.crud.receipt_crud import save_receipt
from app.models.expense import Expense

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def process_receipt(file: UploadFile, db: Session):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # ------------------------
    # SAVE FILE
    # ------------------------
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ------------------------
    # AI ANALYSIS
    # ------------------------
    try:
        result = analyze_receipt(file_path)

    except Exception as e:
        print("\n========== GEMINI ERROR ==========")
        print(e)
        print("==================================\n")

        raise HTTPException(
            status_code=503,
            detail="Gemini AI is temporarily unavailable. Please try again in a few minutes."
        )

    category = (result.get("category") or "Other").strip().title()

    # ------------------------
    # SAVE RECEIPT
    # ------------------------
    receipt = save_receipt(
        db=db,
        data=result,
        image_path=file_path
    )

    # ------------------------
    # AUTO EXPENSE SYNC
    # ------------------------
    try:
        expense = Expense(
            receipt_id=receipt.id,
            item_name=result.get("merchant", "Unknown"),
            price=float(result.get("total_amount") or 0),
            category=category,
        )
        db.add(expense)
        db.commit()

    except Exception as e:
        db.rollback()
        print("Expense sync failed:", e)

    return {
        "message": "Receipt saved successfully",
        "receipt_id": receipt.id,
        "category": category,
        "ai_result": result,
    }