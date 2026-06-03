"""
Internship schemas.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from app.schemas.company import CompanyOut


class RequiredSkillOut(BaseModel):
    id: int
    skill_name: str

    class Config:
        from_attributes = True


class InternshipCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: str = ""
    location: str = "Remote"
    internship_type: str = "Full-time"
    required_skills: List[str] = []


class InternshipUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    internship_type: Optional[str] = None
    required_skills: Optional[List[str]] = None


class InternshipOut(BaseModel):
    id: int
    company_id: int
    title: str
    description: str
    location: str
    internship_type: str
    created_at: datetime
    required_skills: List[RequiredSkillOut] = []
    company: Optional[CompanyOut] = None

    class Config:
        from_attributes = True
