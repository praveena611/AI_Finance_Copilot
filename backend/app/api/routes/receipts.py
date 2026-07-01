from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.receipt_service import process_receipt
from app.models.receipt import Receipt
from app.models.expense import Expense   # IMPORTANT ADD THIS

router = APIRouter(
    prefix="/receipts",
    tags=["Receipts"]
)

# ---------------------------
# UPLOAD RECEIPT
# ---------------------------
@router.post("/upload")
async def upload_receipt(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    return process_receipt(file, db)

# ---------------------------
# GET ALL RECEIPTS
# ---------------------------
@router.get("/")
def get_all_receipts(db: Session = Depends(get_db)):
    receipts = db.query(Receipt).order_by(Receipt.id.desc()).all()
    return receipts

# ---------------------------
# DELETE RECEIPT (FIXED)
# ---------------------------
@router.delete("/{receipt_id}")
def delete_receipt(receipt_id: int, db: Session = Depends(get_db)):
    try:
        print("DELETE REQUEST RECEIVED:", receipt_id)

        # STEP 1: delete child expenses first
        db.query(Expense).filter(
            Expense.receipt_id == receipt_id
        ).delete()

        # STEP 2: delete receipt
        receipt = db.query(Receipt).filter(
            Receipt.id == receipt_id
        ).first()

        if not receipt:
            raise HTTPException(status_code=404, detail="Receipt not found")

        db.delete(receipt)
        db.commit()

        return {
            "message": "Receipt deleted successfully",
            "deleted_id": receipt_id
        }

    except Exception as e:
        db.rollback()
        print("DELETE ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))