export interface Ingredient {
  id: number;
  name: string;
  category?: string;
  unit: string;
}

export interface RecipeIngredient {
  ingredient_id: number;
  amount: number;
  ingredient: Ingredient;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  instructions: string;
  cooking_time_minutes: number;
  ingredients: RecipeIngredient[];
}

export interface RecipeFilterParams {
  search?: string;
  max_cooking_time?: number;
  ingredient_ids?: number[];
}

export interface InventoryItem {
  id: number;
  ingredient_id: number;
  amount: number;
  ingredient: Ingredient;
}

export interface RecipeMatch {
  recipe: Recipe;
  match_percentage: number;
  matched_ingredients: RecipeIngredient[];
  missing_ingredients: RecipeIngredient[];
}

export interface FavoriteRecipe {
  id: number;
  user_id?: number;
  recipe_id: number;
  recipe?: Recipe;
}

// Структура одного ингредиента при создании/обновлении рецепта
export interface RecipePayloadIngredient {
  ingredient_id: number;
  amount: number;
}

// Актуальный DTO для создания и обновления рецепта под FastAPI
export interface CreateRecipePayload {
  title: string;
  description?: string;
  cooking_time_minutes?: number;
  ingredients?: RecipePayloadIngredient[];
  instructions?: string;
}

export interface MissingIngredient {
  ingredient: Ingredient;
  required_amount: number;
  available_amount: number;
  missing_amount: number;
}

export interface RecipeMatchResponse {
  recipe: Recipe;
  match_percentage: number;
  has_all_ingredients: boolean;
  missing_ingredients: MissingIngredient[];
}