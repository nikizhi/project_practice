import { apiClient } from './client';
import type { InventoryItem } from '../types/inventory';

export const getUserInventory = async (): Promise<InventoryItem[]> => {
  const token = localStorage.getItem('token');
  const response = await apiClient.get<InventoryItem[]>('/api/inventory/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addToInventory = async (ingredientId: number, amount?: string): Promise<InventoryItem> => {
  const token = localStorage.getItem('token');
  const response = await apiClient.post<InventoryItem>(
    '/api/inventory/',
    { ingredient_id: ingredientId, amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const removeFromInventory = async (itemId: number): Promise<void> => {
  const token = localStorage.getItem('token');
  await apiClient.delete(`/api/inventory/${itemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};