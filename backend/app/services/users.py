from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.security import get_password_hash, verify_password
from ..models import User


async def get_user_by_email(session: AsyncSession, email: str) -> Optional[User]:
    result = await session.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def create_user(session: AsyncSession, email: str, password: str, full_name: Optional[str] = None) -> User:
    user = User(email=email, full_name=full_name, hashed_password=get_password_hash(password))
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def authenticate_user(session: AsyncSession, email: str, password: str) -> Optional[User]:
    user = await get_user_by_email(session, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user
