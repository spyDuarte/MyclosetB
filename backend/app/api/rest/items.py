from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ...core.auth import get_current_active_user
from ...core.database import get_db
from ...models import User
from ...schemas import ItemCreate, ItemResponse, ItemUpdate
from ...services import (
    create_item,
    delete_item,
    get_item,
    list_items,
    suggest_items_for_outfit,
    update_item,
)

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/", response_model=list[ItemResponse])
async def get_items(
    session: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user)
) -> list[ItemResponse]:
    items = await list_items(session, current_user.id)
    return [ItemResponse.from_orm(item) for item in items]


@router.get("/{item_id}/suggestions", response_model=list[ItemResponse])
async def get_suggestions(
    item_id: int,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> list[ItemResponse]:
    items = await suggest_items_for_outfit(session, current_user.id, item_id)
    return [ItemResponse.from_orm(item) for item in items]


@router.post("/", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item_endpoint(
    item_in: ItemCreate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> ItemResponse:
    item = await create_item(
        session,
        owner_id=current_user.id,
        name=item_in.name,
        category=item_in.category,
        color=item_in.color,
        season=item_in.season,
    )
    return ItemResponse.from_orm(item)


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item_endpoint(
    item_id: int,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> ItemResponse:
    item = await get_item(session, item_id, current_user.id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return ItemResponse.from_orm(item)


@router.put("/{item_id}", response_model=ItemResponse)
async def update_item_endpoint(
    item_id: int,
    item_in: ItemUpdate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> ItemResponse:
    item = await get_item(session, item_id, current_user.id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    updated = await update_item(
        session,
        item,
        name=item_in.name,
        category=item_in.category,
        color=item_in.color,
        season=item_in.season,
    )
    return ItemResponse.from_orm(updated)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item_endpoint(
    item_id: int,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> None:
    item = await get_item(session, item_id, current_user.id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    await delete_item(session, item)
    return None
