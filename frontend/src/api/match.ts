import { apiClient } from './client';
import type { RecipeMatchResponse } from '../types/recipe';

export const matchRecipes = async (): Promise<RecipeMatchResponse[]> => {
  const token = localStorage.getItem('token');
  const response = await apiClient.get<RecipeMatchResponse[]>('/api/match/my-fridge', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};