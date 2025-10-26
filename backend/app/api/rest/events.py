from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ...core.auth import get_current_active_user
from ...core.database import get_db
from ...models import User
from ...schemas import EventCreate, EventResponse, EventUpdate, OutfitResponse
from ...services import (
    create_event,
    delete_event,
    get_event,
    list_events,
    recommend_outfits_for_event,
    update_event,
)

router = APIRouter(prefix="/events", tags=["events"])


@router.get("/", response_model=list[EventResponse])
async def get_events(
    session: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user)
) -> list[EventResponse]:
    events = await list_events(session, current_user.id)
    return [EventResponse.from_orm(event) for event in events]


@router.get("/recommendations/{event_type}", response_model=list[OutfitResponse])
async def get_recommendations(
    event_type: str,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> list[OutfitResponse]:
    outfits = await recommend_outfits_for_event(session, current_user.id, event_type)
    return [OutfitResponse.from_orm(outfit) for outfit in outfits]


@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event_endpoint(
    event_in: EventCreate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> EventResponse:
    event = await create_event(
        session,
        owner_id=current_user.id,
        name=event_in.name,
        event_type=event_in.event_type,
        date=event_in.date,
        outfit_ids=event_in.outfit_ids,
    )
    return EventResponse.from_orm(event)


@router.get("/{event_id}", response_model=EventResponse)
async def get_event_endpoint(
    event_id: int,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> EventResponse:
    event = await get_event(session, event_id, current_user.id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return EventResponse.from_orm(event)


@router.put("/{event_id}", response_model=EventResponse)
async def update_event_endpoint(
    event_id: int,
    event_in: EventUpdate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> EventResponse:
    event = await get_event(session, event_id, current_user.id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    updated = await update_event(
        session,
        event,
        name=event_in.name,
        event_type=event_in.event_type,
        date=event_in.date,
        outfit_ids=event_in.outfit_ids,
    )
    return EventResponse.from_orm(updated)


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event_endpoint(
    event_id: int,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> None:
    event = await get_event(session, event_id, current_user.id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    await delete_event(session, event)
    return None
