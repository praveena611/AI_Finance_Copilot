from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy import extract
from datetime import datetime

from app.models.receipt import Receipt


def get_category_breakdown(db: Session):

    results = (
        db.query(
            Receipt.category,
            func.sum(Receipt.total_amount)
        )
        .group_by(Receipt.category)
        .all()
    )

    return [
        {
            "name": category,
            "value": float(total)
        }
        for category, total in results
    ]


def get_monthly_trend(db: Session):

    results = (
        db.query(
            extract('month', Receipt.created_at).label("month"),
            func.sum(Receipt.total_amount)
        )
        .group_by("month")
        .order_by("month")
        .all()
    )

    month_map = {
        1: "Jan", 2: "Feb", 3: "Mar",
        4: "Apr", 5: "May", 6: "Jun",
        7: "Jul", 8: "Aug", 9: "Sep",
        10: "Oct", 11: "Nov", 12: "Dec"
    }

    return [
        {
            "month": month_map[int(month)],
            "amount": float(total)
        }
        for month, total in results
        if month is not None
    ]