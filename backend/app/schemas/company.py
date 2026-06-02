"""
Company schemas.
"""
from pydantic import BaseModel
from typing import Optional


class CompanyUpdate(BaseModel):
    company_name: Optional[str] = None
    description: Optional[str] = None
    logo: Optional[str] = None


class CompanyOut(BaseModel):
    id: int
    user_id: int
    company_name: str
    description: str
    logo: str

    class Config:
        from_attributes = True
