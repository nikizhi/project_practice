from datetime import datetime, timezone
from typing import List
from sqlalchemy import String, Integer, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.base import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    instructions: Mapped[str] = mapped_column(Text, nullable=False)  # Пошаговая инструкция
    cooking_time_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=15)
    calories: Mapped[float] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    ingredients: Mapped[List["RecipeIngredient"]] = relationship("RecipeIngredient", back_populates="recipe", cascade="all, delete-orphan")

class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    recipe_id: Mapped[int] = mapped_column(Integer, ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False)
    ingredient_id: Mapped[int] = mapped_column(Integer, ForeignKey("ingredients.id", ondelete="CASCADE"), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)

    recipe: Mapped["Recipe"] = relationship("Recipe", back_populates="ingredients")
    ingredient: Mapped["Ingredient"] = relationship("Ingredient")