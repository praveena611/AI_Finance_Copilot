from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.receipt import Receipt


def generate_insights(db: Session):

    total = db.query(func.sum(Receipt.total_amount)).scalar() or 0

    category_spend = (
        db.query(
            Receipt.category,
            func.sum(Receipt.total_amount)
        )
        .group_by(Receipt.category)
        .all()
    )

    insights = []

    # 1. Food dominance check
    for category, amount in category_spend:
        percent = (amount / total) * 100 if total else 0

        if category == "Food" and percent > 40:
            insights.append(
                f"You spend {percent:.1f}% on Food. Consider reducing food delivery."
            )

        if percent > 50:
            insights.append(
                f"{category} is your highest spending category at {percent:.1f}%."
            )

    # 2. Low data case
    if total < 1000:
        insights.append("Not enough data yet. Keep uploading receipts.")

    return {
        "total_spending": total,
        "insights": insights
    }