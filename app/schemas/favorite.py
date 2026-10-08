from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.recipe import RecipeResponse

class FavoriteRecipeCreate(BaseModel):
    recipe_id: int

class FavoriteRecipeResponse(BaseModel):
    id: int
    user_id: int
    recipe_id: int
    created_at: datetime
    recipe: RecipeResponse

    model_config = ConfigDict(from_attributes=True)