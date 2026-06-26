from fastapi import FastAPI

app = FastAPI(title="AI Finance Copilot API")

@app.get("/")
def root():
    return {
        "message": "Welcome to AI Finance Copilot 🚀"
    }

@app.get("/health")
def health():
    return {
        "status": "Backend is running"
    }