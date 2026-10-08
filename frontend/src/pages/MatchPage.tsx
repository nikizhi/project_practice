import { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Clock, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { matchRecipes } from '../api/match';
import { useToast } from '../context/ToastContext';
import type { RecipeMatchResponse } from '../types/recipe';

export const MatchPage: React.FC = () => {
  const [matched, setMatched] = useState<RecipeMatchResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleMatch = async () => {
    setLoading(true);
    try {
      const results = await matchRecipes();
      setMatched(results);
      setSearched(true);
      showToast(`Найдено подходящих рецептов: ${results.length}`);
    } catch (err) {
      console.error(err);
      showToast('Ошибка при поиске рецептов', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 sm:p-10 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center gap-3">
            <span>✨</span> Подбор рецептов
          </h1>
          <p className="mt-3 text-emerald-100 text-sm sm:text-base leading-relaxed">
            Система автоматически проанализирует продукты из вашего холодильника и подберет блюда, которые вы можете приготовить прямо сейчас!
          </p>
          <button
            onClick={handleMatch}
            disabled={loading}
            className="mt-6 flex items-center gap-2 px-6 py-3.5 bg-white text-emerald-700 font-extrabold rounded-2xl shadow-md hover:bg-emerald-50 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-emerald-600" />
            {loading ? 'Идет поиск...' : 'Подобрать рецепты'}
          </button>
        </div>
      </div>
      {searched && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Подходящие блюда ({matched.length})
          </h2>
          {matched.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                К сожалению, ничего не найдено. Попробуйте добавить больше продуктов в ваш холодильник!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matched.map((item) => {
                const recipe = item.recipe;
                const timeValue = recipe.cooking_time_minutes;

                return (
                  <div
                    key={recipe.id}
                    onClick={() => navigate(`/recipes/${recipe.id}`)}
                    className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                          item.has_all_ingredients 
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                        }`}>
                          {item.has_all_ingredients ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Все продукты есть
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5" /> Совпадение: {item.match_percentage}%
                            </>
                          )}
                        </span>

                        {timeValue && (
                          <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {timeValue} мин.
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                        {recipe.description || 'Описание рецепта отсутствует...'}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                      {item.missing_ingredients.length > 0 ? (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-bold text-rose-500">Не хватает: </span>
                          {item.missing_ingredients
                            .map((m) => `${m.ingredient?.name || 'Продукт'} (${m.missing_amount} ${m.ingredient?.unit || ''})`)
                            .join(', ')}
                        </div>
                      ) : (
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <ChefHat className="w-4 h-4" /> Можно готовить прямо сейчас!
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchPage;