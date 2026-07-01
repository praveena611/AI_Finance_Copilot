from sqlalchemy.orm import Session

from app.models.budget import Budget


def get_all_budgets(db: Session):
    return (
        db.query(Budget)
        .order_by(Budget.category)
        .all()
    )


def get_budget_by_category(db: Session, category: str):
    return (
        db.query(Budget)
        .filter(Budget.category == category)
        .first()
    )


def create_budget(
    db: Session,
    category: str,
    monthly_limit: int,
):
    existing = (
        db.query(Budget)
        .filter(Budget.category == category)
        .first()
    )

    if existing:
        return None

    budget = Budget(
        category=category,
        monthly_limit=monthly_limit,
    )

    db.add(budget)
    db.commit()
    db.refresh(budget)

    return budget


def update_budget(
    db: Session,
    budget_id: int,
    monthly_limit: int,
):
    budget = (
        db.query(Budget)
        .filter(Budget.id == budget_id)
        .first()
    )

    if not budget:
        return None

    budget.monthly_limit = monthly_limit

    db.commit()
    db.refresh(budget)

    return budget


def delete_budget(
    db: Session,
    budget_id: int,
):
    budget = (
        db.query(Budget)
        .filter(Budget.id == budget_id)
        .first()
    )

    if not budget:
        return False

    db.delete(budget)
    db.commit()

    return True