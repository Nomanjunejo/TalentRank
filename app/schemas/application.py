"""
Application schemas.
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.candidate import CandidateOut
from app.schemas.internship import InternshipOut


class ApplicationCreate(BaseModel):
    internship_id: int


class ApplicationStatusUpdate(BaseModel):
    status: str


class ApplicationOut(BaseModel):
    id: int
    candidate_id: int
    internship_id: int
    match_percentage: float
    status: str
    applied_at: datetime
    candidate: Optional[CandidateOut] = None
    internship: Optional[InternshipOut] = None

    class Config:
        from_attributes = True
