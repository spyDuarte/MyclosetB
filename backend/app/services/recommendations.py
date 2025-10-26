from collections import Counter
from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import Item, Outfit


async def recommend_outfits_for_event(session: AsyncSession, owner_id: int, event_type: str) -> List[Outfit]:
    # Simple heuristic: match outfits containing items tagged for the season or category used most frequently
    result = await session.execute(select(Outfit).where(Outfit.owner_id == owner_id))
    outfits = list(result.scalars().unique().all())
    if not outfits:
        return []

    item_counter: Counter[str] = Counter()
    for outfit in outfits:
        for item in outfit.items:
            if item.season:
                item_counter[item.season] += 1
            if item.category:
                item_counter[item.category] += 1

    preferred_tag = None
    if item_counter:
        preferred_tag = item_counter.most_common(1)[0][0]

    if event_type and preferred_tag:
        filtered = [
            outfit
            for outfit in outfits
            if any(preferred_tag in {item.season, item.category} for item in outfit.items)
        ]
        return filtered or outfits
    return outfits


async def suggest_items_for_outfit(session: AsyncSession, owner_id: int, base_item_id: int) -> List[Item]:
    base_item = await session.get(Item, base_item_id)
    if not base_item or base_item.owner_id != owner_id:
        return []
    result = await session.execute(select(Item).where(Item.owner_id == owner_id))
    items = list(result.scalars().all())
    complementary = [
        item
        for item in items
        if item.id != base_item.id and (item.season == base_item.season or item.color == base_item.color)
    ]
    return complementary
