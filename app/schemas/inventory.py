from pydantic import BaseModel, Field, ConfigDict
from app.schemas.ingredient import IngredientResponse

class InventoryItemCreate(BaseModel):
    ingredient_id: int
    amount: float = Field(..., gt=0, description="Количество ингредиента")

class InventoryItemResponse(BaseModel):
    id: int
    user_id: int
    ingredient_id: int
    amount: float
    ingredient: IngredientResponse

    model_config = ConfigDict(from_attributes=True)