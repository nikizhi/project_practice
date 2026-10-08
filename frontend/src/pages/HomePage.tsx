import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Heart, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { RecipeCard } from '../components/RecipeCard';
import { getRecipes } from '../api/recipes';
import { fetchFavorites } from '../api/favorites';
import type { Recipe, FavoriteRecipe } from '../types/recipe';

export const HomePage: React.FC = () => {
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [recipesData, favoritesData] = await Promise.all([
          getRecipes(),
          fetchFavorites().catch(() => []),
        ]);

        setPopularRecipes(recipesData.slice(0, 6));

        const favIds = new Set<number>(
          (favoritesData as FavoriteRecipe[]).map((fav) => fav.recipe_id ?? fav.recipe?.id ?? fav.id)
        );
        setFavoriteRecipeIds(favIds);
      } catch (err) {
        console.error('Ошибка при загрузке данных для главной страницы:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Ваш кулинарный гид
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            Готовьте вкусные блюда легко и с удовольствием
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
            Откройте для себя сотни проверенных рецептов, сохраняйте любимые блюда в избранное и создавайте собственные шедевры.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/recipes')}
              className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer text-sm"
            >
              <BookOpen className="w-4 h-4" /> Перейти к рецептам
            </button>
            <button
              onClick={() => navigate('/favorites')}
              className="flex items-center gap-2 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-2xl transition-all active:scale-95 cursor-pointer text-sm"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Избранное
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <span>🔥</span> Популярные рецепты
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              Лучшие блюда, выбранные нашими пользователями
            </p>
          </div>

          <button
            onClick={() => navigate('/recipes')}
            className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-semibold text-sm transition-colors cursor-pointer"
          >
            Смотреть все <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 font-medium">Загрузка...</div>
        ) : popularRecipes.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
            <Utensils className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 font-medium">Рецепты пока не добавлены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRecipes.map((recipe) => (
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
    </div>
  );
};

export default HomePage;