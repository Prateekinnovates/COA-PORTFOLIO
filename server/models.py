"""SQLAlchemy ORM model for the assignments table."""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base


class Assignment(Base):
    __tablename__ = "assignments"

    id           = Column(Integer, primary_key=True, index=True)
    title        = Column(String(500), nullable=False)
    question     = Column(Text, nullable=False)
    topic        = Column(String(200), nullable=True)
    category     = Column(String(200), nullable=True)
    date         = Column(String(50),  nullable=True)   # stored as ISO string for flexibility
    difficulty   = Column(String(50),  nullable=True)   # Easy / Medium / Hard
    notes        = Column(Text, nullable=True)
    answer       = Column(Text, nullable=True)
    solution     = Column(Text, nullable=True)
    reference    = Column(String(1000), nullable=True)
    created_at   = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at   = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                          onupdate=lambda: datetime.now(timezone.utc))
