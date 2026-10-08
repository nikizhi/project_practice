import { useState } from 'react';
import { Clock, Heart } from 'lucide-react';
import type { Recipe } from '../types/recipe';
import { addToFavorites, removeFromFavorites } from '../api/favorites';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  isFavoriteInitial?: boolean;
  onFavoriteToggle?: (isFav?: boolean) => void | Promise<void>;
}

const imageUrl = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800';

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onClick,
  isFavoriteInitial = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);
  const [favLoading, setFavLoading] = useState(false);

  const time = recipe.cooking_time_minutes;

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favLoading) return;
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

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative"
    >
      <div className="space-y-3">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="w-full h-48 object-cover rounded-2xl mb-4 group-hover:scale-[1.02] transition-transform duration-200"
        />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
          {recipe.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
          {recipe.description || 'Описание отсутствует'}
        </p>
      </div>
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
          <Clock className="w-4 h-4" />
          <span>{time ? `${time} мин` : 'Время не указано'}</span>
        </div>
        <button
          onClick={handleToggleFavorite}
          disabled={favLoading}
          aria-label="В избранное"
          className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
            isFavorite
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500'
              : 'bg-gray-50 dark:bg-gray-700/50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40'
          }`}
        >
          <Heart className={`w-5 h-5 transition-transform active:scale-125 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;