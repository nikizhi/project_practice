from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.base import Base

class FavoriteRecipe(Base):
    __tablename__ = "favorite_recipes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint('user_id', 'recipe_id', name='_user_recipe_uc'),)

    user = relationship("User", back_populates="favorites")
    recipe = relationship("Recipe")