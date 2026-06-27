import os
import shutil

from fastapi import UploadFile

from app.ai.gemini_receipt import analyze_receipt
from app.crud.receipt_crud import save_receipt

UPLOAD_DIR = "app/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


def process_receipt(file: UploadFile, db):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = analyze_receipt(file_path)

    receipt = save_receipt(
        db=db,
        data=result,
        image_path=file_path
    )

    return {
        "message": "Receipt saved successfully",
        "receipt_id": receipt.id,
        "ai_result": result
    }