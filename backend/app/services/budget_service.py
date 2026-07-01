from sqlalchemy.orm import Session

from app.crud import budget_crud

from sqlalchemy import func
from app.models.receipt import Receipt

# -----------------------------
# GET ALL BUDGETS (UPDATED)
# -----------------------------
def get_all_budgets(db: Session):
    budgets = budget_crud.get_all_budgets(db)

    result = []
    total_allocated = 0

    for budget in budgets:

        # Skip monthly budget row from category list
        if budget.category == "MONTHLY_BUDGET":
            continue

        # -----------------------------
        # REAL SPENT CALCULATION
        # -----------------------------
        spent = (
            db.query(func.coalesce(func.sum(Receipt.total_amount), 0))
            .filter(Receipt.category == budget.category)
            .scalar()
        ) or 0

        remaining = budget.monthly_limit - spent

        percentage = (
            (spent / budget.monthly_limit) * 100
            if budget.monthly_limit > 0
            else 0
        )

        if percentage < 60:
            status = "good"
        elif percentage < 90:
            status = "warning"
        elif percentage < 100:
            status = "critical"
        else:
            status = "over"

        total_allocated += budget.monthly_limit

        result.append(
            {
                "id": budget.id,
                "category": budget.category,
                "limit": budget.monthly_limit,
                "spent": spent,
                "remaining": remaining,
                "percentage": round(percentage),
                "status": status,
            }
        )

    # -----------------------------
    # MONTHLY BUDGET LOGIC
    # -----------------------------
    monthly_budget_row = budget_crud.get_budget_by_category(
        db,
        "MONTHLY_BUDGET",
    )

    monthly_budget = (
        monthly_budget_row.monthly_limit
        if monthly_budget_row
        else 0
    )

    # Total spending from receipts
    total_spent = (
        db.query(func.coalesce(func.sum(Receipt.total_amount), 0))
        .scalar()
    ) or 0

    remaining_budget = max(
        monthly_budget - total_spent,
        0,
    )

    return {
        "monthly_budget": monthly_budget,
        "total_spent": round(total_spent, 2),
        "allocated": total_allocated,
        "remaining": round(remaining_budget, 2),
        "budgets": result,
    }


# -----------------------------
# CREATE BUDGET
# -----------------------------
def create_budget(
    db: Session,
    category: str,
    monthly_limit: int,
):
    existing = budget_crud.get_budget_by_category(
        db,
        category,
    )

    if existing:
        raise ValueError("Category already exists")

    return budget_crud.create_budget(
        db,
        category,
        monthly_limit,
    )


# -----------------------------
# UPDATE BUDGET
# -----------------------------
def update_budget(
    db: Session,
    budget_id: int,
    monthly_limit: int,
):
    return budget_crud.update_budget(
        db,
        budget_id,
        monthly_limit,
    )


# -----------------------------
# DELETE BUDGET
# -----------------------------
def delete_budget(
    db: Session,
    budget_id: int,
):
    return budget_crud.delete_budget(
        db,
        budget_id,
    )