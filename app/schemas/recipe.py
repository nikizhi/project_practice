from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, PositiveInt, PositiveFloat
from app.schemas.ingredient import IngredientResponse

class RecipeIngredientCreate(BaseModel):
    ingredient_id: int
    amount: float

class RecipeCreate(BaseModel):
    title: str
    description: Optional[str] = None
    instructions: str
    cooking_time_minutes: int
    calories: Optional[float] = None
    ingredients: List[RecipeIngredientCreate]

class RecipeFilter(BaseModel):
    model_config = ConfigDict(extra="forbid")

    q: Optional[str] = Field(None, description="Поиск по названию или описанию")
    max_cooking_time: Optional[int] = Field(None, ge=1, description="Макс. время готовки (минуты)")
    min_calories: Optional[float] = Field(None, ge=0, description="Мин. калории")
    max_calories: Optional[float] = Field(None, ge=0, description="Макс. калории")

class IngredientBase(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)

class RecipeIngredientResponse(BaseModel):
    ingredient_id: int
    amount: float
    ingredient: IngredientResponse

    model_config = ConfigDict(from_attributes=True)


class RecipeResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    instructions: str
    cooking_time_minutes: int
    calories: Optional[float] = None
    ingredients: List[RecipeIngredientResponse] = []

    model_config = ConfigDict(from_attributes=True)