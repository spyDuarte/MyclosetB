from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class OutfitBase(BaseModel):
    name: str
    description: Optional[str] = None
    item_ids: List[int] = Field(default_factory=list)


class OutfitCreate(OutfitBase):
    pass


class OutfitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    item_ids: Optional[List[int]] = None


class OutfitResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class OutfitWithRelations(OutfitResponse):
    items: List["ItemResponse"] = Field(default_factory=list)
    events: List["EventResponse"] = Field(default_factory=list)
