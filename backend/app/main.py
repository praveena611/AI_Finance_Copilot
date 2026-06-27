from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router

from app.database.database import engine
from app.database.base import Base

# Import models so SQLAlchemy registers them
from app.models.receipt import Receipt
from app.models.expense import Expense

print(Base.metadata.tables.keys())
# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Finance Copilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
def home():
    return {
        "message": "AI Finance Copilot API Running 🚀"
    }