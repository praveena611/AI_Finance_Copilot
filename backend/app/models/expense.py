from sqlalchemy import Column, Integer, String, Float, ForeignKey

from app.database.base import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)

    receipt_id = Column(Integer, ForeignKey("receipts.id"))

    item_name = Column(String)

    price = Column(Float)