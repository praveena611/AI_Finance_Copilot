from fastapi import APIRouter
from app.api.routes.receipts import router as receipt_router

api_router = APIRouter()

api_router.include_router(receipt_router)