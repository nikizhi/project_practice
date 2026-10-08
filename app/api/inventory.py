from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.core.db import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.inventory import UserInventory
from app.models.ingredient import Ingredient
from app.schemas.inventory import InventoryItemCreate, InventoryItemResponse

router = APIRouter(prefix="/inventory", tags=["Inventory (Fridge)"])


@router.get("/", response_model=List[InventoryItemResponse])
def get_user_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)):
    items = (
        db.query(UserInventory)
        .options(joinedload(UserInventory.ingredient))
        .filter(UserInventory.user_id == current_user.id)
        .all())
    return items


@router.post("/", response_model=InventoryItemResponse, status_code=201)
def add_or_update_inventory_item(
    item_in: InventoryItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)):
    ingredient = db.query(Ingredient).filter(Ingredient.id == item_in.ingredient_id).first()
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ингредиент не найден")
    existing_item = (
        db.query(UserInventory)
        .filter(
            UserInventory.user_id == current_user.id,
            UserInventory.ingredient_id == item_in.ingredient_id
        ).first())

    if existing_item:
        existing_item.amount = item_in.amount
        db.commit()
        db.refresh(existing_item)
        return existing_item
    new_item = UserInventory(
        user_id=current_user.id,
        ingredient_id=item_in.ingredient_id,
        amount=item_in.amount)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return (
        db.query(UserInventory)
        .options(joinedload(UserInventory.ingredient))
        .filter(UserInventory.id == new_item.id)
        .first()
    )


@router.delete("/{ingredient_id}", status_code=204)
def remove_inventory_item(
    ingredient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = (
        db.query(UserInventory)
        .filter(
            UserInventory.user_id == current_user.id,
            UserInventory.ingredient_id == ingredient_id
        ).first())
    
    if not item:
        raise HTTPException(status_code=404, detail="Продукт не найден в вашем холодильнике")

    db.delete(item)
    db.commit()
    return None