import type { Ingredient } from './recipe';

export interface InventoryItem {
  id: number;
  ingredient_id: number;
  amount?: string | number;
  ingredient: Ingredient;
}