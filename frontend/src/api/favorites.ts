import { apiClient } from './client';
import type { Recipe } from '../types/recipe';

export const fetchFavorites = async (): Promise<Recipe[]> => {
  const response = await apiClient.get('/api/favorites/');
  return response.data;
};

export const addToFavorites = async (recipeId: number) => {
  const response = await apiClient.post('/api/favorites/', {
    recipe_id: recipeId,
  });
  return response.data;
};

export const removeFromFavorites = async (recipeId: number) => {
  const response = await apiClient.delete(`/api/favorites/${recipeId}`);
  return response.data;
};