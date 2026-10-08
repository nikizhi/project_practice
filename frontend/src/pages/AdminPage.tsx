import { useState, useEffect } from 'react';
import { getRecipes, getRecipeById, deleteRecipe } from '../api/recipes';
import { getIngredients, deleteIngredient } from '../api/ingredients';
import { RecipeModal } from '../components/RecipeModal';
import { IngredientModal } from '../components/IngredientModal';
import { useToast } from '../context/ToastContext';
import type { Recipe, Ingredient } from '../types/recipe';
import { Plus, Edit, Trash2, Clock, ChefHat, Carrot, BookOpen, Users, Construction } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recipes' | 'ingredients' | 'users'>('recipes');

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState<boolean>(true);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loadingIngredients, setLoadingIngredients] = useState<boolean>(true);
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState<boolean>(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

  const { showToast } = useToast();

  const fetchRecipesList = async () => {
    try {
      setLoadingRecipes(true);
      const data = await getRecipes();
      setRecipes(data);
    } catch (err) {
      console.error('Ошибка загрузки списка рецептов:', err);
      showToast('Не удалось загрузить список рецептов', 'error');
    } finally {
      setLoadingRecipes(false);
    }
  };

  const fetchIngredientsList = async () => {
    try {
      setLoadingIngredients(true);
      const data = await getIngredients();
      setIngredients(data);
    } catch (err) {
      console.error('Ошибка загрузки списка ингредиентов:', err);
      showToast('Не удалось загрузить список ингредиентов', 'error');
    } finally {
      setLoadingIngredients(false);
    }
  };

  useEffect(() => {
    fetchRecipesList();
    fetchIngredientsList();
  }, []);

  const handleOpenCreateRecipe = () => {
    setSelectedRecipe(null);
    setIsRecipeModalOpen(true);
  };

  const handleOpenEditRecipe = async (id: number) => {
    try {
      const detailedRecipe = await getRecipeById(id);
      setSelectedRecipe(detailedRecipe);
      setIsRecipeModalOpen(true);
    } catch (err) {
      console.error('Ошибка загрузки рецепта по ID:', err);
      showToast('Не удалось загрузить данные рецепта', 'error');
    }
  };

  const handleDeleteRecipe = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот рецепт?')) return;
    try {
      await deleteRecipe(id);
      showToast('Рецепт успешно удален');
      fetchRecipesList();
    } catch (err) {
      console.error('Ошибка при удалении рецепта:', err);
      showToast('Ошибка при удалении рецепта', 'error');
    }
  };

  const handleRecipeModalSuccess = () => {
    setIsRecipeModalOpen(false);
    setSelectedRecipe(null);
    fetchRecipesList();
    showToast('Рецепт сохранен!');
  };

  const handleOpenCreateIngredient = () => {
    setSelectedIngredient(null);
    setIsIngredientModalOpen(true);
  };

  const handleOpenEditIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIsIngredientModalOpen(true);
  };

  const handleDeleteIngredient = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот ингредиент?')) return;
    try {
      await deleteIngredient(id);
      showToast('Ингредиент удален');
      fetchIngredientsList();
    } catch (err) {
      console.error('Ошибка при удалении ингредиента:', err);
      showToast('Ошибка при удалении ингредиента', 'error');
    }
  };

  const handleIngredientModalSuccess = () => {
    setIsIngredientModalOpen(false);
    setSelectedIngredient(null);
    fetchIngredientsList();
    showToast('Ингредиент сохранен!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Панель управления</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Управление базой данных рецептов и ингредиентами</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700 w-fit">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'recipes'
                ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Рецепты ({recipes.length})
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ingredients'
                ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Carrot className="w-4 h-4" /> Ингредиенты ({ingredients.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Пользователи
          </button>
        </div>
      </div>
      {activeTab === 'recipes' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleOpenCreateRecipe}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Добавить рецепт
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            {loadingRecipes ? (
              <div className="text-center py-12 text-gray-400">Загрузка данных...</div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-12 text-gray-400">Рецепты не найдены</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50/50 dark:bg-gray-900/50">
                      <th className="py-4 px-6">Название блюда</th>
                      <th className="py-4 px-6">Время приготовления</th>
                      <th className="py-4 px-6 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                    {recipes.map((recipe) => {
                      const timeValue = recipe.cooking_time_minutes;
                      return (
                        <tr key={recipe.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                          <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                              <ChefHat className="w-5 h-5" />
                            </div>
                            <span className="line-clamp-1">{recipe.title}</span>
                          </td>
                          <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                            {timeValue ? (
                              <span className="inline-flex items-center gap-1.5 font-medium">
                                <Clock className="w-4 h-4 text-gray-400" />
                                {timeValue} мин.
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditRecipe(recipe.id)}
                                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                                title="Редактировать"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteRecipe(recipe.id)}
                                className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                                title="Удалить"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'ingredients' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleOpenCreateIngredient}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Добавить ингредиент
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            {loadingIngredients ? (
              <div className="text-center py-12 text-gray-400">Загрузка данных...</div>
            ) : ingredients.length === 0 ? (
              <div className="text-center py-12 text-gray-400">Ингредиенты не найдены</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50/50 dark:bg-gray-900/50">
                      <th className="py-4 px-6">ID</th>
                      <th className="py-4 px-6">Название ингредиента</th>
                      <th className="py-4 px-6">Категория</th>
                      <th className="py-4 px-6">Единица измерения</th>
                      <th className="py-4 px-6 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                    {ingredients.map((ing) => (
                      <tr key={ing.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                        <td className="py-4 px-6 font-mono text-gray-400">#{ing.id}</td>
                        <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                            <Carrot className="w-5 h-5" />
                          </div>
                          <span className="line-clamp-1">{ing.name}</span>
                        </td>
                        <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                          {ing.category || '—'}
                        </td>
                        <td className="py-4 px-6 text-gray-600 dark:text-gray-300">
                          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold">
                            {ing.unit}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditIngredient(ing)}
                              className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                              title="Редактировать"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteIngredient(ing.id)}
                              className="p-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Construction className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Управление пользователями</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Этот раздел находится в разработке. Скоро здесь появится возможность просмотра списка пользователей и управления их ролями.
            </p>
          </div>
        </div>
      )}
      {isRecipeModalOpen && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setIsRecipeModalOpen(false)}
          onSuccess={handleRecipeModalSuccess}
        />
      )}
      {isIngredientModalOpen && (
        <IngredientModal
          ingredient={selectedIngredient}
          onClose={() => setIsIngredientModalOpen(false)}
          onSuccess={handleIngredientModalSuccess}
        />
      )}
    </div>
  );
};

export default AdminPage;