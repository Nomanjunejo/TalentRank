"""
Application routes — apply, list, rank, update status.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database import get_db
from app.models import User, Candidate, Company, Internship, Application
from app.schemas.application import ApplicationOut, ApplicationCreate, ApplicationStatusUpdate
from app.auth.dependencies import require_candidate, require_company
from app.services.matching import calculate_match_percentage
from app.utils.constants import VALID_STATUSES

router = APIRouter(prefix="/api/applications", tags=["Applications"])


@router.post("", response_model=ApplicationOut, status_code=201)
def apply_to_internship(
    payload: ApplicationCreate,
    user: User = Depends(require_candidate),
    db: Session = Depends(get_db),
):
    candidate = db.query(Candidate).filter(Candidate.user_id == user.id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    internship = db.query(Internship).filter(Internship.id == payload.internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    existing = (
        db.query(Application)
        .filter(Application.candidate_id == candidate.id, Application.internship_id == internship.id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied to this internship")

    candidate_skill_names = [s.skill_name for s in candidate.skills]
    required_skill_names = [s.skill_name for s in internship.required_skills]
    match = calculate_match_percentage(candidate_skill_names, required_skill_names)

    application = Application(
        candidate_id=candidate.id,
        internship_id=internship.id,
        match_percentage=match,
        status="Applied",
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@router.get("/mine", response_model=List[ApplicationOut])
def my_applications(user: User = Depends(require_candidate), db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.user_id == user.id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate profile not found")
    return (
        db.query(Application)
        .options(
            joinedload(Application.internship).joinedload(Internship.company),
            joinedload(Application.internship).joinedload(Internship.required_skills),
        )
        .filter(Application.candidate_id == candidate.id)
        .order_by(Application.applied_at.desc())
        .all()
    )


@router.get("/internship/{internship_id}", response_model=List[ApplicationOut])
def applicants_for_internship(
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

    return (
        db.query(Application)
        .options(
            joinedload(Application.candidate).joinedload(Candidate.skills),
            joinedload(Application.internship).joinedload(Internship.required_skills),
        )
        .filter(Application.internship_id == internship_id)
        .order_by(Application.match_percentage.desc(), Application.applied_at.asc())
        .all()
    )


@router.get("/company/all", response_model=List[ApplicationOut])
def all_company_applications(user: User = Depends(require_company), db: Session = Depends(get_db)):
    """All applications across all internships owned by the logged-in company."""
    company = db.query(Company).filter(Company.user_id == user.id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return (
        db.query(Application)
        .join(Internship, Application.internship_id == Internship.id)
        .options(
            joinedload(Application.candidate).joinedload(Candidate.skills),
            joinedload(Application.internship).joinedload(Internship.required_skills),
        )
        .filter(Internship.company_id == company.id)
        .order_by(Application.match_percentage.desc(), Application.applied_at.desc())
        .all()
    )


@router.patch("/{application_id}/status", response_model=ApplicationOut)
def update_status(
    application_id: int,
    payload: ApplicationStatusUpdate,
    user: User = Depends(require_company),
    db: Session = Depends(get_db),
):
    if payload.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Allowed: {VALID_STATUSES}")
    company = db.query(Company).filter(Company.user_id == user.id).first()
    application = (
        db.query(Application)
        .join(Internship, Application.internship_id == Internship.id)
        .filter(Application.id == application_id)
        .first()
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    if application.internship.company_id != company.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    application.status = payload.status
    db.commit()
    db.refresh(application)
    return application
