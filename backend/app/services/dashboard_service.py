from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.receipt import Receipt
from app.crud.dashboard_crud import get_recent_receipts


def get_dashboard_summary(db: Session):

    total_spending = db.query(func.sum(Receipt.total_amount)).scalar() or 0

    total_receipts = db.query(func.count(Receipt.id)).scalar() or 0

    top_category = (
        db.query(
            Receipt.category,
            func.sum(Receipt.total_amount)
        )
        .group_by(Receipt.category)
        .order_by(func.sum(Receipt.total_amount).desc())
        .first()
    )

    return {
        "total_spending": float(total_spending),
        "total_receipts": total_receipts,
        "top_category": top_category[0] if top_category else "N/A",
    }


def recent_receipts(db: Session):

    receipts = get_recent_receipts(db)

    return [
        {
            "id": receipt.id,
            "merchant": receipt.merchant,
            "category": receipt.category,
            "amount": receipt.total_amount,
            "date": receipt.receipt_date,
        }
        for receipt in receipts
    ]