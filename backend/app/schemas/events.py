from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class EventBase(BaseModel):
    name: str
    event_type: str
    date: date
    outfit_ids: List[int] = Field(default_factory=list)


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    name: Optional[str] = None
    event_type: Optional[str] = None
    date: Optional[date] = None
    outfit_ids: Optional[List[int]] = None


class EventResponse(BaseModel):
    id: int
    name: str
    event_type: str
    date: date
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class EventWithRelations(EventResponse):
    outfits: List["OutfitResponse"] = Field(default_factory=list)
