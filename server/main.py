"""
FastAPI application — COA Portfolio backend.

Environment variables (set in .env or hosting platform):
  DATABASE_URL      : PostgreSQL connection string (falls back to SQLite locally)
  COA_ADMIN_TOKEN   : Secret token required for write operations
  FRONTEND_ORIGIN   : Deployed frontend URL for CORS (e.g. https://yoursite.onrender.com)
"""

import os
from typing import Optional
from datetime import datetime, timezone

from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, field_validator
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from database import engine, get_db, DB_BACKEND
from models import Assignment, Base

load_dotenv()

# ─── Create tables ────────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ─── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="COA Portfolio API",
    description="Backend for Prateek's COA Lab assignments tracker.",
    version="1.0.0",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
_frontend_origin = os.getenv("FRONTEND_ORIGIN", "")
_allowed_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
if _frontend_origin:
    _allowed_origins.append(_frontend_origin.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Auth ─────────────────────────────────────────────────────────────────────
_bearer = HTTPBearer(auto_error=False)
_ADMIN_TOKEN = os.getenv("COA_ADMIN_TOKEN", "")


def require_admin(credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer)):
    if not _ADMIN_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin token not configured on server.",
        )
    if not credentials or credentials.credentials != _ADMIN_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing admin token.",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ─── Pydantic schemas ─────────────────────────────────────────────────────────
class AssignmentBase(BaseModel):
    title:      str
    question:   str
    topic:      Optional[str] = None
    category:   Optional[str] = None
    date:       Optional[str] = None
    difficulty: Optional[str] = None
    notes:      Optional[str] = None
    answer:     Optional[str] = None
    solution:   Optional[str] = None
    reference:  Optional[str] = None

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("title cannot be blank")
        return v.strip()

    @field_validator("question")
    @classmethod
    def question_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("question cannot be blank")
        return v.strip()

    @field_validator("difficulty")
    @classmethod
    def valid_difficulty(cls, v: Optional[str]) -> Optional[str]:
        if v and v not in ("Easy", "Medium", "Hard"):
            raise ValueError("difficulty must be Easy, Medium, or Hard")
        return v


class AssignmentCreate(AssignmentBase):
    pass


class AssignmentUpdate(AssignmentBase):
    title:    Optional[str] = None  # type: ignore[assignment]
    question: Optional[str] = None  # type: ignore[assignment]


class AssignmentOut(AssignmentBase):
    id:         int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}


# ─── Health ───────────────────────────────────────────────────────────────────
@app.get("/api/health", tags=["health"])
def health():
    return {
        "status": "ok",
        "db_backend": DB_BACKEND,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


# ─── Assignments ──────────────────────────────────────────────────────────────
@app.get("/api/assignments", response_model=list[AssignmentOut], tags=["assignments"])
def list_assignments(
    search:     Optional[str] = Query(None),
    topic:      Optional[str] = Query(None),
    category:   Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Assignment)
    if search:
        like = f"%{search}%"
        q = q.filter(
            Assignment.title.ilike(like)
            | Assignment.question.ilike(like)
            | Assignment.topic.ilike(like)
        )
    if topic:      q = q.filter(Assignment.topic.ilike(f"%{topic}%"))
    if category:   q = q.filter(Assignment.category.ilike(f"%{category}%"))
    if difficulty: q = q.filter(Assignment.difficulty == difficulty)
    return q.order_by(Assignment.id.desc()).all()


@app.post("/api/assignments", response_model=AssignmentOut, status_code=status.HTTP_201_CREATED, tags=["assignments"])
def create_assignment(
    body: AssignmentCreate,
    db:   Session = Depends(get_db),
    _:    None    = Depends(require_admin),
):
    row = Assignment(**body.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@app.get("/api/assignments/{assignment_id}", response_model=AssignmentOut, tags=["assignments"])
def get_assignment(assignment_id: int, db: Session = Depends(get_db)):
    row = db.get(Assignment, assignment_id)
    if not row:
        raise HTTPException(status_code=404, detail=f"Assignment {assignment_id} not found.")
    return row


@app.put("/api/assignments/{assignment_id}", response_model=AssignmentOut, tags=["assignments"])
def update_assignment(
    assignment_id: int,
    body: AssignmentUpdate,
    db:   Session = Depends(get_db),
    _:    None    = Depends(require_admin),
):
    row = db.get(Assignment, assignment_id)
    if not row:
        raise HTTPException(status_code=404, detail=f"Assignment {assignment_id} not found.")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    row.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(row)
    return row


@app.delete("/api/assignments/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["assignments"])
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    _:  None    = Depends(require_admin),
):
    row = db.get(Assignment, assignment_id)
    if not row:
        raise HTTPException(status_code=404, detail=f"Assignment {assignment_id} not found.")
    db.delete(row)
    db.commit()
