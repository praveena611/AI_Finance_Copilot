from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.budget import BudgetCreate, BudgetUpdate
from app.services import budget_service

router = APIRouter(
    prefix="/budget",
    tags=["Budget"],
)


@router.get("/")
def get_budgets(db: Session = Depends(get_db)):
    return budget_service.get_all_budgets(db)


@router.post("/")
def create_budget(
    budget: BudgetCreate,
    db: Session = Depends(get_db),
):
    try:
        return budget_service.create_budget(
            db,
            budget.category,
            budget.monthly_limit,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.put("/{budget_id}")
def update_budget(
    budget_id: int,
    budget: BudgetUpdate,
    db: Session = Depends(get_db),
):
    updated_budget = budget_service.update_budget(
        db,
        budget_id,
        budget.monthly_limit,
    )

    if not updated_budget:
        raise HTTPException(
            status_code=404,
            detail="Budget not found",
        )

    return updated_budget


@router.delete("/{budget_id}")
def delete_budget(
    budget_id: int,
    db: Session = Depends(get_db),
):
    success = budget_service.delete_budget(
        db,
        budget_id,
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Budget not found",
        )

    return {
        "message": "Budget deleted successfully"
    }