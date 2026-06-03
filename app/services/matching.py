"""
Skill matching algorithm service.

Match % = (matched skills / total required skills) * 100
Matching is case-insensitive and whitespace-trimmed.
"""
from typing import Iterable


def normalize(skill: str) -> str:
    return skill.strip().lower()


def calculate_match_percentage(
    candidate_skills: Iterable[str],
    required_skills: Iterable[str],
) -> float:
    required = {normalize(s) for s in required_skills if s and s.strip()}
    if not required:
        return 0.0
    candidate = {normalize(s) for s in candidate_skills if s and s.strip()}
    matched = required.intersection(candidate)
    return round((len(matched) / len(required)) * 100, 2)
