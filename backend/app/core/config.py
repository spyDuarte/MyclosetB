from functools import lru_cache
from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    app_name: str = "MyCloset Backend"
    database_url: str = Field(
        default="sqlite+aiosqlite:///./mycloset.db",
        env="DATABASE_URL",
    )
    secret_key: str = Field(default="supersecret", env="SECRET_KEY")
    access_token_expire_minutes: int = Field(default=60, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    algorithm: str = Field(default="HS256", env="JWT_ALGORITHM")

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
