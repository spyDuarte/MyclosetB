from typing import List

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from ...models import Event, Item, Outfit, User
from ...services import list_events, list_items, list_outfits


@strawberry.type
class ItemType:
    id: int
    name: str
    category: str
    color: str | None
    season: str | None


@strawberry.type
class OutfitType:
    id: int
    name: str
    description: str | None
    items: List[ItemType]


@strawberry.type
class EventType:
    id: int
    name: str
    event_type: str
    date: str
    outfits: List[OutfitType]


@strawberry.type
class UserType:
    id: int
    email: str
    full_name: str | None
    items: List[ItemType]
    outfits: List[OutfitType]
    events: List[EventType]


async def resolve_items(session: AsyncSession, current_user: User) -> List[Item]:
    return await list_items(session, current_user.id)


async def resolve_outfits(session: AsyncSession, current_user: User) -> List[Outfit]:
    return await list_outfits(session, current_user.id)


async def resolve_events(session: AsyncSession, current_user: User) -> List[Event]:
    return await list_events(session, current_user.id)


@strawberry.type
class Query:
    async def me(self, info) -> UserType:
        session: AsyncSession = info.context["session"]
        current_user: User = info.context["current_user"]
        items = await resolve_items(session, current_user)
        outfits = await resolve_outfits(session, current_user)
        events = await resolve_events(session, current_user)
        return UserType(
            id=current_user.id,
            email=current_user.email,
            full_name=current_user.full_name,
            items=[ItemType(id=item.id, name=item.name, category=item.category, color=item.color, season=item.season) for item in items],
            outfits=[
                OutfitType(
                    id=outfit.id,
                    name=outfit.name,
                    description=outfit.description,
                    items=[
                        ItemType(
                            id=item.id,
                            name=item.name,
                            category=item.category,
                            color=item.color,
                            season=item.season,
                        )
                        for item in outfit.items
                    ],
                )
                for outfit in outfits
            ],
            events=[
                EventType(
                    id=event.id,
                    name=event.name,
                    event_type=event.event_type,
                    date=event.date.isoformat(),
                    outfits=[
                        OutfitType(
                            id=outfit.id,
                            name=outfit.name,
                            description=outfit.description,
                            items=[
                                ItemType(
                                    id=item.id,
                                    name=item.name,
                                    category=item.category,
                                    color=item.color,
                                    season=item.season,
                                )
                                for item in outfit.items
                            ],
                        )
                        for outfit in event.outfits
                    ],
                )
                for event in events
            ],
        )


schema = strawberry.Schema(query=Query)
