import { apiClient } from './client';
import type { Recipe, RecipeFilterParams, RecipeMatch, CreateRecipePayload } from '../types/recipe';

const API_URL = '/api/recipes';

export const getRecipes = async (params?: RecipeFilterParams): Promise<Recipe[]> => {
  const response = await apiClient.get<Recipe[]>(API_URL, { params });
  return response.data;
};

export const getRecipeById = async (id: string | number): Promise<Recipe> => {
  const response = await apiClient.get<Recipe>(`${API_URL}/${id}`);
  return response.data;
};

export const getMatchedRecipes = async (): Promise<RecipeMatch[]> => {
  const response = await apiClient.post<RecipeMatch[]>(`${API_URL}/match`, {});
  return response.data;
};

export const createRecipe = async (payload: CreateRecipePayload): Promise<Recipe> => {
  const response = await apiClient.post<Recipe>(API_URL, payload);
  return response.data;
};

export const updateRecipe = async (
  id: string | number,
  payload: Partial<CreateRecipePayload>
): Promise<Recipe> => {
  const response = await apiClient.put<Recipe>(`${API_URL}/${id}`, payload);
  return response.data;
};

export const deleteRecipe = async (id: string | number): Promise<void> => {
  await apiClient.delete(`${API_URL}/${id}`);
};