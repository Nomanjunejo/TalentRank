"""
TalentRank — FastAPI application entrypoint.
"""
from fastapi import FastAPI
from app.database import Base, engine
from app.middleware.cors import setup_cors
from app.routes import auth, candidates, companies, internships, applications
from app import models  # noqa: F401  (ensure models import for create_all)

app = FastAPI(
    title="TalentRank API",
    description="Smart Internship Hiring Platform — REST API",
    version="1.0.0",
)

# CORS
setup_cors(app)

# Auto-create tables (use Alembic in production)
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(auth.router)
app.include_router(candidates.router)
app.include_router(companies.router)
app.include_router(internships.router)
app.include_router(applications.router)


@app.get("/")
def root():
    return {"message": "TalentRank API is running", "docs": "/docs"}


@app.get("/api/health")
def health():
    return {"status": "ok"}
