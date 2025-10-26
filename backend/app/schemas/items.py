from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class ItemBase(BaseModel):
    name: str
    category: str
    color: Optional[str] = None
    season: Optional[str] = None


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    season: Optional[str] = None


class ItemResponse(ItemBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class ItemWithRelations(ItemResponse):
    outfits: List["OutfitResponse"] = Field(default_factory=list)
