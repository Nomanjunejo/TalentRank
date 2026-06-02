"""
Authentication routes: register & login.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Candidate, Company
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserOut
from app.auth.security import hash_password, verify_password, create_access_token
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=payload.email,
        password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.flush()  # get user.id

    profile_id = None
    if payload.role == "candidate":
        candidate = Candidate(user_id=user.id, full_name=payload.full_name)
        db.add(candidate)
        db.flush()
        profile_id = candidate.id
    else:
        company = Company(user_id=user.id, company_name=payload.full_name)
        db.add(company)
        db.flush()
        profile_id = company.id

    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(
        access_token=token,
        role=user.role,
        user_id=user.id,
        email=user.email,
        profile_id=profile_id,
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    profile_id = None
    if user.role == "candidate" and user.candidate:
        profile_id = user.candidate.id
    elif user.role == "company" and user.company:
        profile_id = user.company.id

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(
        access_token=token,
        role=user.role,
        user_id=user.id,
        email=user.email,
        profile_id=profile_id or 0,
    )


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
