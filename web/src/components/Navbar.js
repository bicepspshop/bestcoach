import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ trainer }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Главная' },
    { path: '/clients', icon: '👥', label: 'Клиенты' },
    { path: '/workouts', icon: '📅', label: 'Тренировки' },
    { path: '/analytics', icon: '📊', label: 'Аналитика' },
    { path: '/settings', icon: '⚙️', label: 'Настройки' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ path, icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span className="text-xs mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;