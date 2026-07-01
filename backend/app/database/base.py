from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# Register models
from app.models.receipt import Receipt
from app.models.expense import Expense
from app.models.budget import Budget