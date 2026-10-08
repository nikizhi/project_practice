from sqlalchemy import Integer, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.user import User
from app.models.ingredient import Ingredient
from app.core.base import Base

class UserInventory(Base):
    __tablename__ = "user_inventory"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    ingredient_id: Mapped[int] = mapped_column(Integer, ForeignKey("ingredients.id", ondelete="CASCADE"), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)

    user: Mapped["User"] = relationship("User")
    ingredient: Mapped["Ingredient"] = relationship("Ingredient")