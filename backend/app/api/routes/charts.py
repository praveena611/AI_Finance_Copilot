from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.chart_service import (
    get_category_breakdown,
    get_monthly_trend
)

router = APIRouter(prefix="/dashboard", tags=["Charts"])


@router.get("/category-breakdown")
def category_breakdown(db: Session = Depends(get_db)):
    return get_category_breakdown(db)


@router.get("/monthly-trend")
def monthly_trend(db: Session = Depends(get_db)):
    return get_monthly_trend(db)