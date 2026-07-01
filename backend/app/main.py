from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pathlib import Path
import os
from dotenv import load_dotenv

from app.api.router import api_router

from app.database.database import engine
from app.database.base import Base

# Import models so SQLAlchemy registers them
from app.models.receipt import Receipt
from app.models.expense import Expense
from app.models.budget import Budget

# Routes
from app.api.routes import user
from app.api.routes import ai_chat

# -----------------------------
# LOAD ENV (FIXED + RELIABLE)
# -----------------------------

# Go to backend root folder safely
BACKEND_ROOT = Path(__file__).resolve().parents[2]

# Always load backend/.env explicitly
ENV_FILE = BACKEND_ROOT / ".env"

load_dotenv(dotenv_path=ENV_FILE, override=True)

# Debug logs (keep for now)
print("ENV FILE USED:", ENV_FILE)
print("MAIN ENV CHECK:", bool(os.getenv("GOOGLE_API_KEY")))

# -----------------------------
# CREATE TABLES
# -----------------------------
Base.metadata.create_all(bind=engine)

# -----------------------------
# FASTAPI APP
# -----------------------------
app = FastAPI(title="AI Finance Copilot API")

# -----------------------------
# CORS CONFIG
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# ROUTES
# -----------------------------
app.include_router(api_router)
app.include_router(user.router)
app.include_router(ai_chat.router)

# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.get("/")
def home():
    return {
        "message": "AI Finance Copilot API Running 🚀"
    }