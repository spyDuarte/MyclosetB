from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..models import Item, Outfit


async def list_outfits(session: AsyncSession, owner_id: int) -> List[Outfit]:
    result = await session.execute(
        select(Outfit)
        .where(Outfit.owner_id == owner_id)
        .options(selectinload(Outfit.items), selectinload(Outfit.events))
    )
    return list(result.scalars().unique().all())


async def create_outfit(
    session: AsyncSession,
    owner_id: int,
    name: str,
    description: Optional[str],
    item_ids: List[int],
) -> Outfit:
    items = []
    if item_ids:
        result = await session.execute(
            select(Item).where(Item.id.in_(item_ids), Item.owner_id == owner_id).options(selectinload(Item.outfits))
        )
        items = list(result.scalars().all())
    outfit = Outfit(owner_id=owner_id, name=name, description=description, items=items)
    session.add(outfit)
    await session.commit()
    await session.refresh(outfit)
    return outfit


async def get_outfit(session: AsyncSession, outfit_id: int, owner_id: int) -> Optional[Outfit]:
    result = await session.execute(
        select(Outfit)
            .where(Outfit.id == outfit_id, Outfit.owner_id == owner_id)
            .options(selectinload(Outfit.items), selectinload(Outfit.events))
    )
    return result.scalar_one_or_none()


async def update_outfit(
    session: AsyncSession,
    outfit: Outfit,
    name: Optional[str] = None,
    description: Optional[str] = None,
    item_ids: Optional[List[int]] = None,
) -> Outfit:
    if name is not None:
        outfit.name = name
    if description is not None:
        outfit.description = description
    if item_ids is not None:
        result = await session.execute(
            select(Item).where(Item.id.in_(item_ids), Item.owner_id == outfit.owner_id)
        )
        outfit.items = list(result.scalars().all())
    await session.commit()
    await session.refresh(outfit)
    return outfit


async def delete_outfit(session: AsyncSession, outfit: Outfit) -> None:
    await session.delete(outfit)
    await session.commit()
