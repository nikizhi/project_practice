import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Sparkles } from 'lucide-react';
import { createRecipe, updateRecipe } from '../api/recipes';
import type { Recipe, Ingredient, CreateRecipePayload, RecipePayloadIngredient } from '../types/recipe';
import axios from 'axios';

interface RecipeModalProps {
  recipe?: Recipe | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose, onSuccess }) => {
  const isEdit = Boolean(recipe);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cookingTimeMinutes, setCookingTimeMinutes] = useState<number | ''>('');
  const [instructions, setInstructions] = useState('');
  
  const [ingredientRows, setIngredientRows] = useState<RecipePayloadIngredient[]>([
    { ingredient_id: 0, amount: 0 },
  ]);

  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get<Ingredient[]>('/api/ingredients')
      .then((res) => setAvailableIngredients(res.data))
      .catch((err) => console.error('Ошибка загрузки ингредиентов:', err));
  }, []);

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title || '');
      setDescription(recipe.description || '');
      setCookingTimeMinutes(recipe.cooking_time_minutes ?? '');
      setInstructions(typeof recipe.instructions === 'string' ? recipe.instructions : '');

      if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        const rows = recipe.ingredients.map((ri) => ({
          ingredient_id: ri.ingredient_id ?? ri.ingredient?.id ?? 0,
          amount: ri.amount ?? 0,
        }));
        setIngredientRows(rows.length > 0 ? rows : [{ ingredient_id: 0, amount: 0 }]);
      }
    }
  }, [recipe]);

  const handleIngredientChange = (index: number, field: keyof RecipePayloadIngredient, value: string | number) => {
    const updated = [...ingredientRows];
    updated[index] = { ...updated[index], [field]: value === '' ? 0 : Number(value) };
    setIngredientRows(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      
      const payload: CreateRecipePayload = {
        title,
        description,
        cooking_time_minutes: cookingTimeMinutes !== '' ? Number(cookingTimeMinutes) : 0,
        instructions: instructions,
        ingredients: ingredientRows.filter((r) => r.ingredient_id > 0 && r.amount > 0),
      };

      if (isEdit && recipe) {
        await updateRecipe(recipe.id, payload);
      } else {
        await createRecipe(payload);
      }

      onSuccess();
    } catch (err) {
      console.error('Ошибка при сохранении рецепта:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/65 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl border border-gray-100 dark:border-gray-700 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            {isEdit ? 'Редактировать рецепт' : 'Новый рецепт'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Название блюда *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Паста Карбонара"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Описание
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Время приготовления (мин) *
            </label>
            <input
              type="number"
              required
              value={cookingTimeMinutes}
              onChange={(e) => setCookingTimeMinutes(e.target.value ? Number(e.target.value) : '')}
              placeholder="30"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Ингредиенты
              </label>
              <button
                type="button"
                onClick={() => setIngredientRows([...ingredientRows, { ingredient_id: 0, amount: 0 }])}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Добавить
              </button>
            </div>
            <div className="space-y-2">
              {ingredientRows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={row.ingredient_id || ''}
                    onChange={(e) => handleIngredientChange(idx, 'ingredient_id', e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                  >
                    <option value="">Выберите ингредиент...</option>
                    {availableIngredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} ({ing.unit})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    step="any"
                    value={row.amount || ''}
                    onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)}
                    placeholder="Кол-во"
                    className="w-28 px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                  />

                  {ingredientRows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setIngredientRows(ingredientRows.filter((_, i) => i !== idx))}
                      className="p-2.5 text-gray-400 hover:text-rose-500 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Инструкции по приготовлению *
            </label>
            <textarea
              rows={4}
              required
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Опишите шаги приготовления..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white resize-none"
            />
          </div>
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Сохранение...' : isEdit ? 'Сохранить изменения' : 'Создать рецепт'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeModal;