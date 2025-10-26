from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

from .config import get_settings


Base = declarative_base()


def get_engine():
    settings = get_settings()
    return create_async_engine(settings.database_url, future=True, echo=False)


def get_session_maker():
    engine = get_engine()
    return async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    session_maker = get_session_maker()
    async with session_maker() as session:
        yield session
