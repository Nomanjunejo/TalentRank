"""
Candidate profile routes.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Candidate, CandidateSkill
from app.schemas.candidate import CandidateOut, CandidateUpdate
from app.auth.dependencies import get_current_user, require_candidate

router = APIRouter(prefix="/api/candidates", tags=["Candidates"])


@router.get("/me", response_model=CandidateOut)
def get_my_candidate_profile(user: User = Depends(require_candidate), db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.user_id == user.id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate profile not found")
    return candidate


@router.put("/me", response_model=CandidateOut)
def update_my_candidate_profile(
    payload: CandidateUpdate,
    user: User = Depends(require_candidate),
    db: Session = Depends(get_db),
):
    candidate = db.query(Candidate).filter(Candidate.user_id == user.id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    data = payload.model_dump(exclude_unset=True)
    skills = data.pop("skills", None)

    for k, v in data.items():
        setattr(candidate, k, v)

    if skills is not None:
        # replace existing skills
        db.query(CandidateSkill).filter(CandidateSkill.candidate_id == candidate.id).delete()
        seen = set()
        for s in skills:
            normalized = s.strip()
            if normalized and normalized.lower() not in seen:
                seen.add(normalized.lower())
                db.add(CandidateSkill(candidate_id=candidate.id, skill_name=normalized))

    db.commit()
    db.refresh(candidate)
    return candidate


@router.get("/{candidate_id}", response_model=CandidateOut)
def get_candidate(candidate_id: int, _: User = Depends(get_current_user), db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate
