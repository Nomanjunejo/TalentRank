"""
Internship CRUD routes.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import Optional, List
from app.database import get_db
from app.models import User, Company, Internship, RequiredSkill
from app.schemas.internship import InternshipCreate, InternshipUpdate, InternshipOut
from app.auth.dependencies import require_company, get_current_user

router = APIRouter(prefix="/api/internships", tags=["Internships"])


def _replace_required_skills(db: Session, internship_id: int, skills: List[str]):
    db.query(RequiredSkill).filter(RequiredSkill.internship_id == internship_id).delete()
    seen = set()
    for s in skills:
        s_clean = s.strip()
        if s_clean and s_clean.lower() not in seen:
            seen.add(s_clean.lower())
            db.add(RequiredSkill(internship_id=internship_id, skill_name=s_clean))


@router.get("", response_model=List[InternshipOut])
def list_internships(
    search: Optional[str] = Query(None),
    skill: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    """Public: list internships with optional search/skill filter & pagination."""
    q = db.query(Internship).options(
        joinedload(Internship.required_skills),
        joinedload(Internship.company),
    )
    if search:
        like = f"%{search}%"
        q = q.filter(or_(Internship.title.ilike(like), Internship.description.ilike(like), Internship.location.ilike(like)))
    if skill:
        q = q.join(RequiredSkill).filter(RequiredSkill.skill_name.ilike(f"%{skill}%"))
    return q.order_by(Internship.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/mine", response_model=List[InternshipOut])
def my_internships(user: User = Depends(require_company), db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.user_id == user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return (
        db.query(Internship)
        .options(joinedload(Internship.required_skills), joinedload(Internship.company))
        .filter(Internship.company_id == company.id)
        .order_by(Internship.created_at.desc())
        .all()
    )


@router.get("/{internship_id}", response_model=InternshipOut)
def get_internship(internship_id: int, db: Session = Depends(get_db)):
    internship = (
        db.query(Internship)
        .options(joinedload(Internship.required_skills), joinedload(Internship.company))
        .filter(Internship.id == internship_id)
        .first()
    )
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    return internship


@router.post("", response_model=InternshipOut, status_code=201)
def create_internship(
    payload: InternshipCreate,
    user: User = Depends(require_company),
    db: Session = Depends(get_db),
):
    company = db.query(Company).filter(Company.user_id == user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company profile not found")
    internship = Internship(
        company_id=company.id,
        title=payload.title,
        description=payload.description,
        location=payload.location,
        internship_type=payload.internship_type,
    )
    db.add(internship)
    db.flush()
    _replace_required_skills(db, internship.id, payload.required_skills)
    db.commit()
    db.refresh(internship)
    return internship


@router.put("/{internship_id}", response_model=InternshipOut)
def update_internship(
    internship_id: int,
    payload: InternshipUpdate,
    user: User = Depends(require_company),
    db: Session = Depends(get_db),
):
    company = db.query(Company).filter(Company.user_id == user.id).first()
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    if internship.company_id != company.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    data = payload.model_dump(exclude_unset=True)
    skills = data.pop("required_skills", None)
    for k, v in data.items():
        setattr(internship, k, v)
    if skills is not None:
        _replace_required_skills(db, internship.id, skills)
    db.commit()
    db.refresh(internship)
    return internship


@router.delete("/{internship_id}", status_code=204)
def delete_internship(
    internship_id: int,
    user: User = Depends(require_company),
    db: Session = Depends(get_db),
):
    company = db.query(Company).filter(Company.user_id == user.id).first()
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    if internship.company_id != company.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(internship)
    db.commit()
    return None
