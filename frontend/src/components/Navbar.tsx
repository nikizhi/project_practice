import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user && (user.role === 'ADMIN' || user.is_admin);

  const desktopNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 text-center cursor-pointer select-none ${
      isActive
        ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm border border-gray-200/50 dark:border-gray-600 font-bold'
        : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/60 dark:hover:bg-gray-700/50'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
      isActive
        ? 'bg-emerald-600 text-white shadow-xs'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 hover:text-emerald-600'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-700/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 no-underline">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xl sm:text-2xl shadow-md group-hover:scale-105 transition-transform duration-200">
              🍳
            </div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-emerald-800 dark:text-emerald-400">
              RecipeGeni
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800/90 rounded-2xl border border-gray-200/80 dark:border-gray-700/80">
            <NavLink to="/recipes" className={desktopNavLinkClass}>
              Рецепты
            </NavLink>
            <NavLink to="/inventory" className={desktopNavLinkClass}>
              Холодильник
            </NavLink>
            <NavLink to="/match" className={desktopNavLinkClass}>
              Подбор рецептов
            </NavLink>
            {user && (
              <NavLink to="/favorites" className={desktopNavLinkClass}>
                Избранное
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin/recipes" className={desktopNavLinkClass}>
                Админка
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700/50 p-1.5 pl-3 rounded-xl border border-gray-200 dark:border-gray-600">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 max-w-[140px] truncate hidden sm:inline">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-500 rounded-lg transition-all cursor-pointer"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink to="/login" className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-emerald-600">
                  Войти
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all active:scale-95"
                >
                  Регистрация
                </NavLink>
              </div>
            )}
          </div>
        </div>
        <div className="md:hidden flex items-center justify-start gap-2 py-2.5 border-t border-gray-100 dark:border-gray-700/50 overflow-x-auto">
          <NavLink to="/recipes" className={mobileNavLinkClass}>
            Рецепты
          </NavLink>
          <NavLink to="/inventory" className={mobileNavLinkClass}>
            Холодильник
          </NavLink>
          <NavLink to="/match" className={mobileNavLinkClass}>
            Подбор рецептов
          </NavLink>
          {user && (
            <NavLink to="/favorites" className={mobileNavLinkClass}>
              Избранное
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/recipes" className={mobileNavLinkClass}>
              Админка
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;