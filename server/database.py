"""
Database setup: reads DATABASE_URL from env.
  - If set, normalises postgres:// → postgresql+psycopg2:// for psycopg2 driver.
  - Falls back to SQLite ./coa_local.db for local development.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

_raw_url = os.getenv("DATABASE_URL", "")

def _normalise_url(url: str) -> str:
    """Render sets DATABASE_URL as postgres://… which psycopg2 needs as postgresql+psycopg2://"""
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg2://", 1)
    elif url.startswith("postgresql://") and "+psycopg2" not in url:
        url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
    return url

if _raw_url:
    DATABASE_URL = _normalise_url(_raw_url)
    DB_BACKEND = "postgresql"
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
else:
    _sqlite_path = os.path.join(os.path.dirname(__file__), "coa_local.db")
    DATABASE_URL = f"sqlite:///{_sqlite_path}"
    DB_BACKEND = "sqlite"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency: yields a DB session and ensures it is closed."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
