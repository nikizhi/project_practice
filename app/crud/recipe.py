from typing import List, Optional
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from app.models.recipe import Recipe

def get_filtered_recipes(
    db: Session,
    q: Optional[str] = None,
    max_cooking_time: Optional[int] = None,
    min_calories: Optional[float] = None,
    max_calories: Optional[float] = None,
    limit: int = 20) -> List[Recipe]:
    stmt = select(Recipe)

    if q:
        search_pattern = f"%{q}%"
        stmt = stmt.where(
            or_(
                Recipe.title.ilike(search_pattern),
                Recipe.description.ilike(search_pattern)
            )
        )
    
    if max_cooking_time is not None:
        stmt = stmt.where(Recipe.cooking_time_minutes <= max_cooking_time)

    if min_calories is not None:
        stmt = stmt.where(Recipe.calories >= min_calories)

    if max_calories is not None:
        stmt = stmt.where(Recipe.calories <= max_calories)

    stmt = stmt.limit(limit)
    return list(db.scalars(stmt).all())