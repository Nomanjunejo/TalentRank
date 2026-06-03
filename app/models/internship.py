"""
Internship and required-skills models.
"""
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Internship(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    location = Column(String(150), default="Remote")
    internship_type = Column(String(50), default="Full-time")  # Full-time / Part-time / Remote
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    company = relationship("Company", back_populates="internships")
    required_skills = relationship("RequiredSkill", back_populates="internship", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="internship", cascade="all, delete-orphan")


class RequiredSkill(Base):
    __tablename__ = "required_skills"

    id = Column(Integer, primary_key=True, index=True)
    internship_id = Column(Integer, ForeignKey("internships.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String(100), nullable=False)

    internship = relationship("Internship", back_populates="required_skills")
