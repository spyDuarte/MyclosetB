from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..models import Event, Outfit


async def list_events(session: AsyncSession, owner_id: int) -> List[Event]:
    result = await session.execute(
        select(Event)
        .where(Event.owner_id == owner_id)
        .options(selectinload(Event.outfits).selectinload(Outfit.items))
    )
    return list(result.scalars().unique().all())


async def create_event(
    session: AsyncSession,
    owner_id: int,
    name: str,
    event_type: str,
    date,
    outfit_ids: List[int],
) -> Event:
    outfits = []
    if outfit_ids:
        result = await session.execute(
            select(Outfit)
            .where(Outfit.id.in_(outfit_ids), Outfit.owner_id == owner_id)
            .options(selectinload(Outfit.items))
        )
        outfits = list(result.scalars().all())
    event = Event(owner_id=owner_id, name=name, event_type=event_type, date=date, outfits=outfits)
    session.add(event)
    await session.commit()
    await session.refresh(event)
    return event


async def get_event(session: AsyncSession, event_id: int, owner_id: int) -> Optional[Event]:
    result = await session.execute(
        select(Event)
        .where(Event.id == event_id, Event.owner_id == owner_id)
        .options(selectinload(Event.outfits).selectinload(Outfit.items))
    )
    return result.scalar_one_or_none()


async def update_event(
    session: AsyncSession,
    event: Event,
    name: Optional[str] = None,
    event_type: Optional[str] = None,
    date=None,
    outfit_ids: Optional[List[int]] = None,
) -> Event:
    if name is not None:
        event.name = name
    if event_type is not None:
        event.event_type = event_type
    if date is not None:
        event.date = date
    if outfit_ids is not None:
        result = await session.execute(
            select(Outfit)
            .where(Outfit.id.in_(outfit_ids), Outfit.owner_id == event.owner_id)
            .options(selectinload(Outfit.items))
        )
        event.outfits = list(result.scalars().all())
    await session.commit()
    await session.refresh(event)
    return event


async def delete_event(session: AsyncSession, event: Event) -> None:
    await session.delete(event)
    await session.commit()
