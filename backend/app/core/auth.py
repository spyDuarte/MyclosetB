from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import User
from ..schemas import Token
from ..services import authenticate_user
from .config import get_settings
from .database import get_db
from .security import create_access_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


async def login_for_access_token(session: AsyncSession, email: str, password: str) -> Token:
    user = await authenticate_user(session, email, password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials")
    settings = get_settings()
    expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    token = create_access_token(str(user.id), expires_delta)
    expires_at = datetime.utcnow() + expires_delta
    return Token(access_token=token, expires_at=expires_at)


async def get_current_user(
    token: str = Depends(oauth2_scheme), session: AsyncSession = Depends(get_db)
) -> User:
    from ..core.security import decode_access_token

    user_id = decode_access_token(token)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    user = await session.get(User, int(user_id))
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return current_user
