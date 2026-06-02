"""
Company profile model.
"""
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    company_name = Column(String(150), nullable=False)
    description = Column(Text, default="")
    logo = Column(String(500), default="")

    user = relationship("User", back_populates="company")
    internships = relationship("Internship", back_populates="company", cascade="all, delete-orphan")
