from sqlalchemy.orm import Session
from app.models.receipt import Receipt


def get_recent_receipts(db: Session, limit: int = 10):
    return (
        db.query(Receipt)
        .order_by(Receipt.created_at.desc())
        .limit(limit)
        .all()
    )