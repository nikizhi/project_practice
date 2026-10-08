from typing import List
from pydantic import BaseModel
from app.schemas.recipe import RecipeResponse
from app.schemas.ingredient import IngredientResponse


class MissingIngredient(BaseModel):
    ingredient: IngredientResponse
    required_amount: float
    available_amount: float
    missing_amount: float


class RecipeMatchResponse(BaseModel):
    recipe: RecipeResponse
    match_percentage: float
    has_all_ingredients: bool
    missing_ingredients: List[MissingIngredient]

    class Config:
        from_attributes = True