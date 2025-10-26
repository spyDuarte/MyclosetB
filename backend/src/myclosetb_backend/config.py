"""Runtime configuration for the backend service."""

from functools import lru_cache
from pathlib import Path
from typing import Optional

from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    """Application settings loaded from the environment."""

    environment: str = Field("development", description="Current runtime environment")
    log_level: str = Field("INFO", description="Structured logging level")
    sentry_dsn: Optional[str] = Field(
        default=None, description="Sentry DSN for error and performance monitoring"
    )
    sentry_traces_sample_rate: float = Field(0.1, ge=0.0, le=1.0)
    metrics_namespace: str = Field(
        "myclosetb_backend", description="Namespace applied to exported Prometheus metrics"
    )

    class Config:
        env_file = Path(__file__).resolve().parents[2] / ".env"
        env_file_encoding = "utf-8"
        env_prefix = "BACKEND_"


@lru_cache
def get_settings() -> Settings:
    """Return a cached copy of the application settings."""

    return Settings()


settings = get_settings()
