from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.receipt_service import process_receipt

router = APIRouter(
    prefix="/receipts",
    tags=["Receipts"]
)


@router.post("/upload")
async def upload_receipt(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    return process_receipt(file, db)