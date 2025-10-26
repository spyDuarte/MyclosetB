from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..core.database import Base
from .base import TimestampMixin
from .items import event_outfits, outfit_items


class Outfit(TimestampMixin, Base):
    __tablename__ = "outfits"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    owner = relationship("User", back_populates="outfits")
    items = relationship("Item", secondary=outfit_items, back_populates="outfits")
    events = relationship("Event", secondary=event_outfits, back_populates="outfits")
