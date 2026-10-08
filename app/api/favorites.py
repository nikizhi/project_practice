from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.core.db import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.favorite import FavoriteRecipe
from app.models.recipe import Recipe, RecipeIngredient
from app.schemas.favorite import FavoriteRecipeCreate, FavoriteRecipeResponse

router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.get("/", response_model=List[FavoriteRecipeResponse])
def get_user_favorites(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(FavoriteRecipe)
        .options(
            joinedload(FavoriteRecipe.recipe)
            .joinedload(Recipe.ingredients)
            .joinedload(RecipeIngredient.ingredient)
        )
        .filter(FavoriteRecipe.user_id == current_user.id)
        .all()
    )

@router.post("/", response_model=FavoriteRecipeResponse, status_code=201)
def add_favorite(
    favorite_in: FavoriteRecipeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    recipe_exists = db.query(Recipe.id).filter(Recipe.id == favorite_in.recipe_id).first()
    if not recipe_exists:
        raise HTTPException(status_code=404, detail="Рецепт не найден")
    existing_favorite = (
        db.query(FavoriteRecipe.id)
        .filter(
            FavoriteRecipe.user_id == current_user.id,
            FavoriteRecipe.recipe_id == favorite_in.recipe_id
        ).first())
    if existing_favorite:
        raise HTTPException(status_code=400, detail="Рецепт уже находится в избранном")
    new_favorite = FavoriteRecipe(user_id=current_user.id, recipe_id=favorite_in.recipe_id)
    db.add(new_favorite)
    db.commit()
    
    return (
        db.query(FavoriteRecipe)
        .options(
            joinedload(FavoriteRecipe.recipe)
            .joinedload(Recipe.ingredients)
            .joinedload(RecipeIngredient.ingredient)).filter(FavoriteRecipe.id == new_favorite.id).first())


@router.delete("/{recipe_id}", status_code=204)
def remove_favorite(recipe_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    deleted_count = (
        db.query(FavoriteRecipe).filter(FavoriteRecipe.user_id == current_user.id, FavoriteRecipe.recipe_id == recipe_id)
        .delete(synchronize_session=False))
    if not deleted_count:
        raise HTTPException(status_code=404,detail="Рецепт не найден в избранном")

    db.commit()
    return None
