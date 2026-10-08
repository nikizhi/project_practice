from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.api.deps import get_current_admin
from app.models.user import User
from app.models.ingredient import Ingredient
from app.schemas.ingredient import IngredientCreate, IngredientUpdate, IngredientResponse

router = APIRouter(prefix="/ingredients", tags=["Ingredients"])

@router.get("/", response_model=List[IngredientResponse])
def get_ingredients(
    search: Optional[str] = Query(None, description="Поиск по названию ингредиента"),
    db: Session = Depends(get_db)):
    query = db.query(Ingredient)
    if search:
        query = query.filter(Ingredient.name.ilike(f"%{search}%"))
    return query.all()

@router.post("/", response_model=IngredientResponse, status_code=201)
def create_ingredient(
    ingredient_in: IngredientCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    existing = db.query(Ingredient).filter(Ingredient.name.ilike(ingredient_in.name)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ингредиент с таким названием уже существует.")
    ingredient = Ingredient(
        name=ingredient_in.name,
        unit=ingredient_in.unit,
        category=ingredient_in.category
    )
    db.add(ingredient)
    db.commit()
    db.refresh(ingredient)
    return ingredient

@router.put("/{ingredient_id}", response_model=IngredientResponse)
def update_ingredient(
    ingredient_id: int,
    ingredient_in: IngredientUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    ingredient = db.query(Ingredient).filter(Ingredient.id == ingredient_id).first()
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ингредиент не найден.")
    if ingredient_in.name is not None:
        ingredient.name = ingredient_in.name
    if ingredient_in.unit is not None:
        ingredient.unit = ingredient_in.unit

    db.commit()
    db.refresh(ingredient)
    return ingredient


@router.delete("/{ingredient_id}", status_code=204)
def delete_ingredient(
    ingredient_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    ingredient = db.query(Ingredient).filter(Ingredient.id == ingredient_id).first()
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ингредиент не найден.")

    db.delete(ingredient)
    db.commit()
    return None