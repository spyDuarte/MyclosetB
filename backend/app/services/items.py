from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Item


async def list_items(session: AsyncSession, owner_id: int) -> List[Item]:
    result = await session.execute(select(Item).where(Item.owner_id == owner_id))
    return list(result.scalars().all())


async def create_item(
    session: AsyncSession,
    owner_id: int,
    name: str,
    category: str,
    color: Optional[str] = None,
    season: Optional[str] = None,
) -> Item:
    item = Item(
        owner_id=owner_id,
        name=name,
        category=category,
        color=color,
        season=season,
    )
    session.add(item)
    await session.commit()
    await session.refresh(item)
    return item


async def get_item(session: AsyncSession, item_id: int, owner_id: int) -> Optional[Item]:
    result = await session.execute(select(Item).where(Item.id == item_id, Item.owner_id == owner_id))
    return result.scalar_one_or_none()


async def update_item(session: AsyncSession, item: Item, **kwargs) -> Item:
    for key, value in kwargs.items():
        if value is not None:
            setattr(item, key, value)
    await session.commit()
    await session.refresh(item)
    return item


async def delete_item(session: AsyncSession, item: Item) -> None:
    await session.delete(item)
    await session.commit()
