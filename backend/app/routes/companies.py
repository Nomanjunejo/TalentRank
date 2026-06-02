"""
Company profile routes.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Company
from app.schemas.company import CompanyOut, CompanyUpdate
from app.auth.dependencies import get_current_user, require_company

router = APIRouter(prefix="/api/companies", tags=["Companies"])


@router.get("/me", response_model=CompanyOut)
def get_my_company(user: User = Depends(require_company), db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.user_id == user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")
    return company


@router.put("/me", response_model=CompanyOut)
def update_my_company(
    payload: CompanyUpdate,
    user: User = Depends(require_company),
    db: Session = Depends(get_db),
):
    company = db.query(Company).filter(Company.user_id == user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(company, k, v)
    db.commit()
    db.refresh(company)
    return company


@router.get("/{company_id}", response_model=CompanyOut)
def get_company(company_id: int, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company
