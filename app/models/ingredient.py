from sqlalchemy import String, Integer, Enum
from sqlalchemy.orm import Mapped, mapped_column
from app.core.base import Base

class Ingredient(Base):
    __tablename__ = "ingredients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=True)
    unit: Mapped[str] = mapped_column(String(20), default="г")