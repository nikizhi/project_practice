import { useEffect, useState } from 'react';
import { Heart, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RecipeCard } from '../components/RecipeCard';
import { fetchFavorites, removeFromFavorites } from '../api/favorites';
import { useToast } from '../context/ToastContext';
import type { Recipe, FavoriteRecipe } from '../types/recipe';

export const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        const data = await fetchFavorites();
        const parsedRecipes: Recipe[] = data.map((item: FavoriteRecipe | Recipe) => {
            if ('recipe' in item && item.recipe) {
              return item.recipe;
            }
            return item as Recipe;
          }).filter((recipe): recipe is Recipe => Boolean(recipe && recipe.id));

        setFavorites(parsedRecipes);
      } catch (err) {
        console.error('Ошибка при загрузке избранного:', err);
        showToast('Не удалось загрузить избранное', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, [showToast]);

  const handleRemoveFavorite = async (recipeId: number) => {
    try {
      await removeFromFavorites(recipeId);
      setFavorites((prev) => prev.filter((item) => item.id !== recipeId));
      showToast('Рецепт удален из избранного');
    } catch (err) {
      console.error('Ошибка при удалении из избранного:', err);
      showToast('Ошибка при удалении', 'error');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-400 font-medium max-w-7xl mx-auto">
        Загрузка избранных рецептов...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> Избранные рецепты
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Ваша личная коллекция сохраненных блюд
        </p>
      </div>
      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
          <Utensils className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 font-medium">У вас пока нет сохраненных рецептов</p>
          <button
            onClick={() => navigate('/recipes')}
            className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all active:scale-95 cursor-pointer"
          >
            Перейти в каталог
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavoriteInitial={true}
              onClick={() => navigate(`/recipes/${recipe.id}`)}
              onFavoriteToggle={() => handleRemoveFavorite(recipe.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;