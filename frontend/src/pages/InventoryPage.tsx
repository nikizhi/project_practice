import { useEffect, useState } from 'react';
import { Plus, Trash2, Refrigerator } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import type { Ingredient } from '../types/recipe';
import type { InventoryItem } from '../types/inventory';
import { getUserInventory, addToInventory, removeFromInventory } from '../api/inventory';
import { getIngredients } from '../api/ingredients';

export const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredientId, setSelectedIngredientId] = useState<number | ''>('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      const [invData, ingData] = await Promise.all([getUserInventory(), getIngredients()]);
      setInventory(invData);
      setIngredients(ingData);
    } catch (err) {
      showToast('Ошибка при загрузке данных холодильника', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngredientId) return;

    try {
      await addToInventory(Number(selectedIngredientId), amount);
      showToast('Ингредиент добавлен!');
      setSelectedIngredientId('');
      setAmount('');
      loadData();
    } catch (err) {
      showToast('Ошибка при добавлении в холодильник', 'error');
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await removeFromInventory(id);
      showToast('Ингредиент удален');
      loadData();
    } catch (err) {
      showToast('Ошибка при удалении', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <span>🧊</span> Мой холодильник
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Управляйте своими запасами, чтобы сервис подобрал идеально подходящие блюда
        </p>
        <form onSubmit={handleAdd} className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <select
            value={selectedIngredientId}
            onChange={(e) => setSelectedIngredientId(e.target.value ? Number(e.target.value) : '')}
            required
            className="sm:col-span-6 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
          >
            <option value="">Выберите ингредиент из списка...</option>
            {ingredients.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.name} ({ing.unit})
              </option>
            ))}
          </select>
          <input
            type="number"
            step="any"
            placeholder="Количество"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="sm:col-span-4 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
          />
          <button
            type="submit"
            className="sm:col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </form>
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Продукты в наличии ({inventory.length})
        </h2>
        {loading ? (
          <p className="text-gray-400 font-medium text-center py-8">Загрузка продуктов...</p>
        ) : inventory.length === 0 ? (
          <div className="text-center py-12">
            <Refrigerator className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Ваш холодильник пока пуст</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600"
              >
                <div>
                  <div className="font-bold text-gray-800 dark:text-white">
                    {item.ingredient?.name || `Ингредиент #${item.ingredient_id}`}
                  </div>
                  {item.amount !== undefined && item.amount !== null && (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      {item.amount} {item.ingredient?.unit || ''}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;