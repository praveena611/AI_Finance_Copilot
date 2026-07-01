from pydantic import BaseModel


class BudgetCreate(BaseModel):
    category: str
    monthly_limit: int


class BudgetUpdate(BaseModel):
    monthly_limit: int