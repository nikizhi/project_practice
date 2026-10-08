import { apiClient } from './client';
import type { Ingredient } from '../types/recipe';

const API_URL = '/api/ingredients';

export const getIngredients = async (): Promise<Ingredient[]> => {
  const response = await apiClient.get<Ingredient[]>(API_URL);
  return response.data;
};

export const createIngredient = async (payload: { name: string; unit: string }): Promise<Ingredient> => {
  const response = await apiClient.post<Ingredient>(API_URL, payload);
  return response.data;
};

export const updateIngredient = async (
  id: number | string,
  payload: { name: string; unit: string }
): Promise<Ingredient> => {
  const response = await apiClient.put<Ingredient>(`${API_URL}/${id}`, payload);
  return response.data;
};

export const deleteIngredient = async (id: number | string): Promise<void> => {
  await apiClient.delete(`${API_URL}/${id}`);
};