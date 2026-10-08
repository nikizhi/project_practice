import { useEffect, useState } from 'react';
import { Search, Utensils, Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RecipeCard } from '../components/RecipeCard';
import { getRecipes } from '../api/recipes';
import { fetchFavorites } from '../api/favorites';
import type { Recipe, FavoriteRecipe } from '../types/recipe';

export const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const [titleInput, setTitleInput] = useState('');
  const [maxTimeInput, setMaxTimeInput] = useState('');
  const [appliedTitle, setAppliedTitle] = useState('');
  const [appliedMaxTime, setAppliedMaxTime] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [recipesData, favoritesData] = await Promise.all([
          getRecipes(),
          fetchFavorites().catch(() => []),
        ]);
        setRecipes(recipesData);
        const favIds = new Set<number>(
          (favoritesData as FavoriteRecipe[]).map((fav) => fav.recipe_id ?? fav.recipe?.id ?? fav.id)
        );
        setFavoriteRecipeIds(favIds);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedTitle(titleInput);
    setAppliedMaxTime(maxTimeInput ? Number(maxTimeInput) : null);
  };

  const handleResetFilters = () => {
    setTitleInput('');
    setMaxTimeInput('');
    setAppliedTitle('');
    setAppliedMaxTime(null);
  };

  const filteredRecipes = recipes.filter((r) => {
    const time = r.cooking_time_minutes;
    const matchesTitle = r.title.toLowerCase().includes(appliedTitle.toLowerCase().trim());
    const matchesTime = appliedMaxTime === null || (time !== undefined && time <= appliedMaxTime);
    return matchesTitle && matchesTime;
  });

  const hasActiveFilters = appliedTitle !== '' || appliedMaxTime !== null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <span>📖</span> Каталог рецептов
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Исследуйте вкусы и находите новые кулинарные идеи на каждый день
          </p>
        </div>
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="relative sm:col-span-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Название рецепта..."
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white text-sm transition-all"
            />
          </div>
          <div className="relative sm:col-span-4">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              min="1"
              placeholder="Время (до мин)..."
              value={maxTimeInput}
              onChange={(e) => setMaxTimeInput(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white text-sm transition-all"
            />
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer text-sm"
            >
              <Search className="w-4 h-4" /> Найти
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3.5 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-2xl transition-all cursor-pointer"
                title="Сбросить фильтры"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
      {loading ? (
        <div className="text-center py-16 text-gray-400 font-medium">Загрузка рецептов...</div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-3">
          <Utensils className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 font-medium">По вашему запросу рецепты не найдены</p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-sm font-bold text-emerald-600 hover:text-emerald-500 cursor-pointer"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavoriteInitial={favoriteRecipeIds.has(recipe.id)}
              onClick={() => navigate(`/recipes/${recipe.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesPage;