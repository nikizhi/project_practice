import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RecipesPage } from './pages/RecipesPage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { MatchPage } from './pages/MatchPage';
import { InventoryPage } from './pages/InventoryPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AdminPage } from './pages/AdminPage';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-medium">Загрузка...</div>
      </div>
    );
  }

  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-medium">Проверка прав...</div>
      </div>
    );
  }

  const isAdmin = user && (user.role === 'ADMIN' || user.is_admin === true);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/recipes" replace />;

  return <Layout>{children}</Layout>;
};

export const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/recipes"
        element={
          <ProtectedLayout>
            <RecipesPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/recipes/:id"
        element={
          <ProtectedLayout>
            <RecipeDetailPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/match"
        element={
          <ProtectedLayout>
            <MatchPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedLayout>
            <InventoryPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedLayout>
            <FavoritesPage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/admin/recipes"
        element={
          <AdminLayout>
            <AdminPage />
          </AdminLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;