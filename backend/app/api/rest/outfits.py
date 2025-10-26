from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ...core.auth import get_current_active_user
from ...core.database import get_db
from ...models import Outfit, User
from ...schemas import OutfitCreate, OutfitResponse, OutfitUpdate
from ...services import create_outfit, delete_outfit, get_outfit, list_outfits, update_outfit

router = APIRouter(prefix="/outfits", tags=["outfits"])


@router.get("/", response_model=list[OutfitResponse])
async def get_outfits(
    session: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user)
) -> list[OutfitResponse]:
    outfits = await list_outfits(session, current_user.id)
    return [OutfitResponse.from_orm(outfit) for outfit in outfits]


@router.post("/", response_model=OutfitResponse, status_code=status.HTTP_201_CREATED)
async def create_outfit_endpoint(
    outfit_in: OutfitCreate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> OutfitResponse:
    outfit = await create_outfit(
        session,
        owner_id=current_user.id,
        name=outfit_in.name,
        description=outfit_in.description,
        item_ids=outfit_in.item_ids,
    )
    return OutfitResponse.from_orm(outfit)


@router.get("/{outfit_id}", response_model=OutfitResponse)
async def get_outfit_endpoint(
    outfit_id: int,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> OutfitResponse:
    outfit = await get_outfit(session, outfit_id, current_user.id)
    if not outfit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outfit not found")
    return OutfitResponse.from_orm(outfit)


@router.put("/{outfit_id}", response_model=OutfitResponse)
async def update_outfit_endpoint(
    outfit_id: int,
    outfit_in: OutfitUpdate,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> OutfitResponse:
    outfit = await get_outfit(session, outfit_id, current_user.id)
    if not outfit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outfit not found")
    updated = await update_outfit(
        session,
        outfit,
        name=outfit_in.name,
        description=outfit_in.description,
        item_ids=outfit_in.item_ids,
    )
    return OutfitResponse.from_orm(updated)


@router.delete("/{outfit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_outfit_endpoint(
    outfit_id: int,
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> None:
    outfit = await get_outfit(session, outfit_id, current_user.id)
    if not outfit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outfit not found")
    await delete_outfit(session, outfit)
    return None
