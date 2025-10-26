from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class UserWithRelations(UserResponse):
    items: List["ItemResponse"] = Field(default_factory=list)
    outfits: List["OutfitResponse"] = Field(default_factory=list)
    events: List["EventResponse"] = Field(default_factory=list)
