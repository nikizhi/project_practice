from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class IngredientBase(BaseModel):
    name: str = Field(..., min_length=1, description="Название ингредиента")
    unit: str = Field(..., min_length=1, description="Единица измерения (г, мл, шт и т.д.)")
    category: str = Field(..., min_length=1, description="Категория (Специи, Бакалея, Овощи и т.д.)")


class IngredientCreate(IngredientBase):
    pass


class IngredientUpdate(BaseModel):
    name: Optional[str] = None
    unit: Optional[str] = None
    category: Optional[str] = None


class IngredientResponse(IngredientBase):
    id: int

    model_config = ConfigDict(from_attributes=True)