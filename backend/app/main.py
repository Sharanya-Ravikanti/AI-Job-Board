from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.ai import router as ai_router
from app.database import engine
from app.models import Base
from app.routes import job_router, router as auth_router

# Create database tables on startup so SQLite is ready for use.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HireGen AI API",
    description="AI Recruitment Platform backend",
    version="1.0.0",
)

# Allow the React frontend running locally to consume the API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(job_router)
app.include_router(ai_router)


@app.get("/")
def read_root():
    """Health check endpoint for the API."""
    return {"message": "HireGen AI API is running"}
