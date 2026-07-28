import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models import Base

# SQLite database file stored in the backend project folder.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hiregen.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Yield a database session for each request and close it afterwards."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
