import { apiClient } from './client';
import type { User } from '../types/user';

const AUTH_URL = 'http://127.0.0.1:8000/api/auth';

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const registerUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(`${AUTH_URL}/register`, { email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  const response = await apiClient.post<AuthResponse>(`${AUTH_URL}/login`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

export const getCurrentUser = async (token?: string): Promise<User> => {
  const authToken = token || localStorage.getItem('token');

  if (!authToken) {
    throw new Error('Токен авторизации отсутствует');
  }
  const response = await apiClient.get<User>(`${AUTH_URL}/me`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
};