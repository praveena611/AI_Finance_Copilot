from app.models.receipt import Receipt
from app.models.budget import Budget


def build_finance_context(db):
    """
    Collect all financial data required by the AI Advisor.
    Returns a dictionary that can be passed directly
    to the prompt builder.
    """

    # -------------------------------------------------
    # Receipts
    # -------------------------------------------------

    receipts = db.query(Receipt).all()

    total_spent = sum(
        receipt.total_amount or 0
        for receipt in receipts
    )

    category_totals = {}

    for receipt in receipts:

        category = receipt.category or "Others"

        category_totals[category] = (
            category_totals.get(category, 0)
            + (receipt.total_amount or 0)
        )

    category_breakdown = [
        {
            "category": category,
            "amount": round(amount, 2),
        }
        for category, amount in category_totals.items()
    ]

    # -------------------------------------------------
    # Recent Transactions
    # -------------------------------------------------

    recent_receipts = (
        db.query(Receipt)
        .order_by(Receipt.created_at.desc())
        .limit(10)
        .all()
    )

    recent_transactions = []

    for receipt in recent_receipts:

        recent_transactions.append(
            {
                "merchant": receipt.merchant,
                "category": receipt.category,
                "amount": receipt.total_amount,
                "date": receipt.receipt_date,
            }
        )

    # -------------------------------------------------
    # Budget Intelligence
    # -------------------------------------------------

    budgets = db.query(Budget).all()

    monthly_budget = 0

    budget_summary = []

    over_budget_categories = []

    for budget in budgets:

        if budget.category == "MONTHLY_BUDGET":

            monthly_budget = budget.monthly_limit

            continue

        spent = category_totals.get(
            budget.category,
            0,
        )

        remaining = budget.monthly_limit - spent

        utilization = (
            round(
                (spent / budget.monthly_limit) * 100,
                1,
            )
            if budget.monthly_limit > 0
            else 0
        )

        budget_summary.append(
            {
                "category": budget.category,
                "limit": budget.monthly_limit,
                "spent": round(spent, 2),
                "remaining": round(remaining, 2),
                "utilization": utilization,
            }
        )

        if spent > budget.monthly_limit:
            over_budget_categories.append(
                budget.category
            )

    allocated_budget = sum(
        budget.monthly_limit
        for budget in budgets
        if budget.category != "MONTHLY_BUDGET"
    )

    remaining_budget = max(
        monthly_budget - total_spent,
        0,
    )

    budget_utilization = (
        round(
            (total_spent / monthly_budget) * 100,
            1,
        )
        if monthly_budget > 0
        else 0
    )

    return {
        "income": "Not Available",

        "total_spent": round(
            total_spent,
            2,
        ),

        "monthly_budget": monthly_budget,

        "allocated_budget": allocated_budget,

        "remaining_budget": round(
            remaining_budget,
            2,
        ),

        "budget_utilization": budget_utilization,

        "category_breakdown": category_breakdown,

        "budget_summary": budget_summary,

        "over_budget_categories": over_budget_categories,

        "recent_transactions": recent_transactions,
    }