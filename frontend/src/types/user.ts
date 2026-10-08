export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  created_at?: string;
  is_active?: boolean;
  is_admin?: boolean; // <-- Добавьте это поле
}