from datetime import date

from sqlalchemy import Column, Date, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..core.database import Base
from .base import TimestampMixin
from .items import event_outfits


class Event(TimestampMixin, Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    date = Column(Date, nullable=False, default=date.today)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    owner = relationship("User", back_populates="events")
    outfits = relationship("Outfit", secondary=event_outfits, back_populates="events")
