from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from app.database.base import Base


class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True, index=True)

    merchant = Column(String, nullable=False)

    receipt_date = Column(String)

    total_amount = Column(Float)

    currency = Column(String)

    category = Column(String)

    payment_method = Column(String)

    gst = Column(Float)

    confidence = Column(Float)

    image_path = Column(String)

    created_at = Column(DateTime(timezone=True), server_default=func.now())