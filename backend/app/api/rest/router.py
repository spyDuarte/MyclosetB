from fastapi import APIRouter

from . import auth, events, items, outfits

router = APIRouter(prefix="/api")
router.include_router(auth.router)
router.include_router(items.router)
router.include_router(outfits.router)
router.include_router(events.router)
