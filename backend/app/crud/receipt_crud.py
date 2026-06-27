from app.models.receipt import Receipt
from app.models.expense import Expense


def save_receipt(db, data, image_path):

    receipt = Receipt(
        merchant=data["merchant"],
        receipt_date=data["date"],
        total_amount=data["total_amount"],
        currency=data["currency"],
        category=data["category"],
        payment_method=data["payment_method"],
        gst=data["gst"],
        confidence=data["confidence"],
        image_path=image_path
    )

    db.add(receipt)
    db.commit()
    db.refresh(receipt)

    for item in data["items"]:
        expense = Expense(
            receipt_id=receipt.id,
            item_name=item["name"],
            price=item["price"]
        )

        db.add(expense)

    db.commit()

    return receipt