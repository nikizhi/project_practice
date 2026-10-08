from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload

from app.models.recipe import Recipe, RecipeIngredient
from app.models.ingredient import Ingredient
from app.models.user import User
from app.schemas.recipe import RecipeCreate, RecipeResponse
from app.core.db import get_db
from app.api.deps import get_current_admin

router = APIRouter(prefix="/recipes", tags=["Recipes"])


@router.get("/", response_model=List[RecipeResponse])
def get_recipes(
    search: Optional[str] = Query(None, description="Поиск по названию рецепта"),
    max_cooking_time: Optional[int] = Query(None, description="Максимальное время приготовления в минутах"),
    db: Session = Depends(get_db)):
    query = db.query(Recipe).options(
        selectinload(Recipe.ingredients).selectinload(RecipeIngredient.ingredient))
    if search:
        query = query.filter(Recipe.title.ilike(f"%{search}%"))
    if max_cooking_time is not None:
        query = query.filter(Recipe.cooking_time_minutes <= max_cooking_time)
    return query

@router.get("/match", response_model=List[RecipeResponse])
def match_recipes(
    ingredient_ids: List[int] = Query(..., description="ID ингредиентов в наличии"),
    db: Session = Depends(get_db)):
    if not ingredient_ids:
        return []
    recipes = (
        db.query(Recipe)
        .options(selectinload(Recipe.ingredients).selectinload(RecipeIngredient.ingredient))
        .join(Recipe.ingredients)
        .filter(RecipeIngredient.ingredient_id.in_(ingredient_ids)).distinct().all())
    return recipes

@router.post("/", response_model=RecipeResponse, status_code=201)
def create_recipe(
    recipe_in: RecipeCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    try:
        if recipe_in.ingredients:
            unique_ingredient_ids = set(item.ingredient_id for item in recipe_in.ingredients)
            existing_count = db.query(Ingredient.id).filter(Ingredient.id.in_(unique_ingredient_ids)).count()
            
            if existing_count != len(unique_ingredient_ids):
                raise HTTPException(status_code=400, detail="Некоторые из указанных ингредиентов не найдены в базе данных.")

        new_recipe = Recipe(
            title=recipe_in.title,
            description=recipe_in.description,
            instructions=recipe_in.instructions,
            cooking_time_minutes=recipe_in.cooking_time_minutes,
            calories=getattr(recipe_in, 'calories', None)
        )
        db.add(new_recipe)
        db.flush()

        if recipe_in.ingredients:
            recipe_ingredients = [
                RecipeIngredient(
                    recipe_id=new_recipe.id,
                    ingredient_id=item.ingredient_id,
                    amount=item.amount
                )
                for item in recipe_in.ingredients
            ]
            db.bulk_save_objects(recipe_ingredients)
        db.commit()
        return (
            db.query(Recipe)
            .options(selectinload(Recipe.ingredients).selectinload(RecipeIngredient.ingredient))
            .filter(Recipe.id == new_recipe.id).first()
        )

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка сервера при создании рецепта: {str(e)}")


@router.get("/{recipe_id}", response_model=RecipeResponse)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = (
        db.query(Recipe)
        .options(selectinload(Recipe.ingredients).selectinload(RecipeIngredient.ingredient))
        .filter(Recipe.id == recipe_id).first()
    )
    if not recipe:
        raise HTTPException(
            status_code=404,
            detail="Рецепт не найден"
        )
    return recipe


# 5. PUT: Обновление рецепта
@router.put("/{recipe_id}", response_model=RecipeResponse)
def update_recipe(
    recipe_id: int,
    recipe_in: RecipeCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    recipe_exists = db.query(Recipe.id).filter(Recipe.id == recipe_id).first()
    if not recipe_exists:
        raise HTTPException(status_code=404, detail="Рецепт не найден.")
    try:
        db.query(Recipe).filter(Recipe.id == recipe_id).update({
            Recipe.title: recipe_in.title,
            Recipe.description: recipe_in.description,
            Recipe.instructions: recipe_in.instructions,
            Recipe.cooking_time_minutes: recipe_in.cooking_time_minutes,
            Recipe.calories: getattr(recipe_in, 'calories', None)
        }, synchronize_session=False)

        if recipe_in.ingredients is not None:
            unique_ingredient_ids = set(item.ingredient_id for item in recipe_in.ingredients)
            if unique_ingredient_ids:
                existing_count = db.query(Ingredient.id).filter(Ingredient.id.in_(unique_ingredient_ids)).count()
                if existing_count != len(unique_ingredient_ids):
                    raise HTTPException(status_code=400, detail="Некоторые из указанных ингредиентов не найдены.")
            db.query(RecipeIngredient).filter(RecipeIngredient.recipe_id == recipe_id).delete(synchronize_session=False)
            recipe_ingredients = [
                RecipeIngredient(
                    recipe_id=recipe_id,
                    ingredient_id=item.ingredient_id,
                    amount=item.amount
                )
                for item in recipe_in.ingredients
            ]
            db.bulk_save_objects(recipe_ingredients)

        db.commit()

        return (
            db.query(Recipe)
            .options(selectinload(Recipe.ingredients).selectinload(RecipeIngredient.ingredient))
            .filter(Recipe.id == recipe_id)
            .first()
        )
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при обновлении рецепта: {str(e)}")

@router.delete("/{recipe_id}", status_code=204)
def delete_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    deleted_count = db.query(Recipe).filter(Recipe.id == recipe_id).delete(synchronize_session=False)
    if not deleted_count:
        raise HTTPException(status_code=404, detail="Рецепт не найден.")
    db.commit()
    return None
