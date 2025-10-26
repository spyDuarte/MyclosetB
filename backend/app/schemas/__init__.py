from .auth import Token, TokenPayload
from .events import EventBase, EventCreate, EventResponse, EventUpdate, EventWithRelations
from .items import ItemBase, ItemCreate, ItemResponse, ItemUpdate, ItemWithRelations
from .outfits import OutfitBase, OutfitCreate, OutfitResponse, OutfitUpdate, OutfitWithRelations
from .users import UserBase, UserCreate, UserResponse, UserUpdate, UserWithRelations

__all__ = [
    "Token",
    "TokenPayload",
    "EventBase",
    "EventCreate",
    "EventResponse",
    "EventUpdate",
    "EventWithRelations",
    "ItemBase",
    "ItemCreate",
    "ItemResponse",
    "ItemUpdate",
    "ItemWithRelations",
    "OutfitBase",
    "OutfitCreate",
    "OutfitResponse",
    "OutfitUpdate",
    "OutfitWithRelations",
    "UserBase",
    "UserCreate",
    "UserResponse",
    "UserUpdate",
    "UserWithRelations",
]


def configure_schemas() -> None:
    ItemWithRelations.update_forward_refs(OutfitResponse=OutfitResponse)
    OutfitWithRelations.update_forward_refs(ItemResponse=ItemResponse, EventResponse=EventResponse)
    EventWithRelations.update_forward_refs(OutfitResponse=OutfitResponse)
    UserWithRelations.update_forward_refs(
        ItemResponse=ItemResponse,
        OutfitResponse=OutfitResponse,
        EventResponse=EventResponse,
    )
