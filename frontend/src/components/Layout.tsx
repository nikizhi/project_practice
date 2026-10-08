import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans antialiased">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children || <Outlet />}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 text-center text-xs font-medium text-gray-400">
        <p>© 2026 RecipeGeni. Умный помощник на вашей кухне.</p>
      </footer>
    </div>
  );
};

export default Layout;