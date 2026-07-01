from fastapi import APIRouter
from app.api.routes.receipts import router as receipt_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.charts import router as charts_router
from app.api.routes.insights import router as insights_router
from app.api.routes import budget

api_router = APIRouter()

api_router.include_router(receipt_router)
api_router.include_router(dashboard_router)
api_router.include_router(charts_router)
api_router.include_router(insights_router)
api_router.include_router(budget.router)  # Include the budget router