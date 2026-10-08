import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  ArrowLeft,
  Heart,
  Utensils,
  CheckCircle2,
  ListOrdered,
} from 'lucide-react';
import { getRecipeById } from '../api/recipes';
import { addToFavorites, removeFromFavorites, fetchFavorites } from '../api/favorites';
import type { Recipe } from '../types/recipe';

const imageUrl =
  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800';

export const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const cookingTime = recipe?.cooking_time_minutes;

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        setLoading(true);
        const recipeData = await getRecipeById(Number(id));
        setRecipe(recipeData);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const favoritesData = await fetchFavorites();
          const isFav = favoritesData.some(
            (fav: any) => (fav.recipe_id || fav.recipe?.id || fav.id) === Number(id)
          );
          setIsFavorite(isFav);
        } catch (favErr) {
          console.warn('Не удалось загрузить избранное:', favErr);
        }
      }
    } catch (err) {
      console.error('Ошибка загрузки детальной информации:', err);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, [id]);

const handleToggleFavorite = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return;
  }
  if (!recipe || favLoading) return;
  try {
    setFavLoading(true);
    if (isFavorite) {
      await removeFromFavorites(recipe.id);
      setIsFavorite(false);
    } else {
      await addToFavorites(recipe.id);
      setIsFavorite(true);
    }
  } catch (err) {
    console.error('Ошибка при изменении избранного:', err);
  } finally {
    setFavLoading(false);
  }
};
  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400 font-medium max-w-4xl mx-auto">
        Загрузка рецепта...
      </div>
    );
  }
  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-4">
        <Utensils className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 font-medium text-lg">Рецепт не найден</p>
        <button
          onClick={() => navigate('/recipes')}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all"
        >
          Вернуться в каталог
        </button>
      </div>
    );
  }

  const instructionsList = recipe.instructions ? recipe.instructions.split('\n').filter((step) => step.trim().length > 0) : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Назад
      </button>
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-700 space-y-8">
        <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden shadow-inner">
          <img
            src={imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <button
            onClick={handleToggleFavorite}
            disabled={favLoading}
            className={`absolute top-4 right-4 p-3 rounded-2xl shadow-lg backdrop-blur-md transition-all cursor-pointer ${
              isFavorite
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-900'
            }`}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="text-2xl sm:text-4xl font-extrabold drop-shadow-md">
              {recipe.title}
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold rounded-2xl text-sm border border-emerald-100 dark:border-emerald-800/50">
            <Clock className="w-4 h-4" />
            <span>{cookingTime ? `${cookingTime} мин` : 'Время не указано'}</span>
          </div>
        </div>
        {recipe.description && (
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Описание</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
              {recipe.description}
            </p>
          </div>
        )}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-500" /> Ингредиенты
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipe.ingredients.map((ing: any, idx: number) => {
                const name = typeof ing === 'string' ? ing : ing.name || ing.ingredient?.name || 'Ингредиент';
                const amount = typeof ing === 'object' ? ing.amount || ing.quantity : undefined;
                const unit = typeof ing === 'object' ? ing.unit || ing.ingredient?.unit : undefined;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-700/40 rounded-2xl border border-gray-100 dark:border-gray-700/60"
                  >
                    <span className="flex items-center gap-2 text-gray-800 dark:text-gray-200 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      {name}
                    </span>
                    {amount !== undefined && (
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-xl border border-gray-100 dark:border-gray-700">
                        {amount} {unit || ''}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {instructionsList.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-emerald-500" /> Шаги приготовления
            </h2>
            <div className="space-y-4">
              {instructionsList.map((step, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700/50"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-sm flex-shrink-0 shadow-sm">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed self-center">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailPage;