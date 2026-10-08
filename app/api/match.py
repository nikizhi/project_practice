from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, selectinload

from app.core.db import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.inventory import UserInventory
from app.models.recipe import Recipe, RecipeIngredient
from app.schemas.recipe_match import RecipeMatchResponse, MissingIngredient
from app.schemas.recipe import RecipeResponse

router = APIRouter(prefix="/match", tags=["Match Recipes"])

@router.get("/my-fridge", response_model=List[RecipeMatchResponse])
def match_recipes_from_fridge(
    limit: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)):
    user_inventory = (
        db.query(UserInventory.ingredient_id, UserInventory.amount)
        .filter(UserInventory.user_id == current_user.id)
        .all()
    )

    if not user_inventory:
        return []

    inventory_map = {item.ingredient_id: item.amount for item in user_inventory}
    user_ingredient_ids = list(inventory_map.keys())
    recipes = (
        db.query(Recipe)
        .options(
            selectinload(Recipe.ingredients)
            .selectinload(RecipeIngredient.ingredient)
        )
        .join(Recipe.ingredients).filter(RecipeIngredient.ingredient_id.in_(user_ingredient_ids)).distinct().all()
    )

    results = []
    for recipe in recipes:
        total_ingredients = len(recipe.ingredients)
        if total_ingredients == 0:
            continue
        matched_count = 0.0
        missing_list = []

        for ri in recipe.ingredients:
            available_qty = inventory_map.get(ri.ingredient_id, 0.0)

            if available_qty >= ri.amount:
                matched_count += 1.0
            elif available_qty > 0:
                matched_count += 0.5
            else:
                missing_list.append(
                    MissingIngredient(
                        ingredient=ri.ingredient,
                        required_amount=ri.amount,
                        available_amount=available_qty,
                        missing_amount=ri.amount
                    )
                )

        match_percentage = round((matched_count / total_ingredients) * 100, 1)
        results.append(
            RecipeMatchResponse(
                recipe=RecipeResponse.model_validate(recipe),
                match_percentage=min(100.0, match_percentage),
                has_all_ingredients=(len(missing_list) == 0),
                missing_ingredients=missing_list
            )
        )

    results.sort(key=lambda x: x.match_percentage, reverse=True)
    
    return results[0:limit]