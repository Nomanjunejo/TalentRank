"""
Application configuration loaded from environment variables.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/talentrank"
    SECRET_KEY: str = "supersecretkey_change_me_please_in_production_env"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    class Config:
        env_file = ".env"
        extra = "ignore"



from dotenv import load_dotenv
load_dotenv()

@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
