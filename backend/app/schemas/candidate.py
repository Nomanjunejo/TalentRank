"""
Candidate schemas.
"""
from pydantic import BaseModel
from typing import List, Optional


class CandidateSkillOut(BaseModel):
    id: int
    skill_name: str

    class Config:
        from_attributes = True


class CandidateUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    education: Optional[str] = None
    resume: Optional[str] = None
    profile_picture: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    skills: Optional[List[str]] = None


class CandidateOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    bio: str
    education: str
    resume: str
    profile_picture: str
    github_url: str
    linkedin_url: str
    skills: List[CandidateSkillOut] = []

    class Config:
        from_attributes = True
