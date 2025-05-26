import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ApiService } from './services/api';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Workouts from './pages/Workouts';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Компонент навигации
const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: '🏠', label: 'Главная' },
    { path: '/clients', icon: '👥', label: 'Клиенты' },
    { path: '/workouts', icon: '🏋️', label: 'Тренировки' },
    { path: '/analytics', icon: '📊', label: 'Аналитика' },
    { path: '/settings', icon: '⚙️', label: 'Настройки' }
  ];

  const handleNavClick = (path) => {
    window.location.hash = `#${path}`;
  };

  return (
    <div className="bottom-nav">
      <div className="nav-container">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => handleNavClick(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Компонент загрузки
const LoadingScreen = () => (
  <div className="app-container">
    <div className="content-container">
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">Инициализация приложения...</div>
      </div>
    </div>
  </div>
);

// Компонент ошибки
const ErrorScreen = ({ error, onRetry }) => (
  <div className="app-container">
    <div className="content-container">
      <div className="card text-center">
        <div className="card-body">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray-800)' }}>
            Ошибка загрузки
          </h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: '24px' }}>
            {error || 'Произошла неизвестная ошибка'}
          </p>
          <button className="btn btn-primary" onClick={onRetry}>
            Попробовать снова
          </button>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Получаем ID пользователя
      let telegramId = null;
      
      // Проверяем Telegram WebApp
      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        telegramId = window.Telegram.WebApp.initDataUnsafe.user.id;
        console.log('Telegram ID получен:', telegramId);
      } else {
        // Fallback для тестирования
        const urlParams = new URLSearchParams(window.location.search);
        telegramId = urlParams.get('telegram_id') || Date.now().toString();
        console.log('Используется тестовый ID:', telegramId);
      }

      // Получаем или создаем тренера
      let trainerData = await ApiService.getTrainerByTelegramId(telegramId);
      
      if (!trainerData) {
        console.log('Тренер не найден, создаем нового...');
        
        const newTrainerData = {
          telegram_id: parseInt(telegramId),
          first_name: window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || 'Тренер',
          last_name: window.Telegram?.WebApp?.initDataUnsafe?.user?.last_name || '',
          username: window.Telegram?.WebApp?.initDataUnsafe?.user?.username || null,
          is_active: true
        };
        
        try {
          trainerData = await ApiService.createTrainer(newTrainerData);
          console.log('Создан новый тренер:', trainerData);
        } catch (createError) {
          console.warn('Ошибка создания тренера:', createError);
          // Используем временные данные
          trainerData = {
            id: `temp-${telegramId}`,
            telegram_id: parseInt(telegramId),
            first_name: newTrainerData.first_name,
            last_name: newTrainerData.last_name,
            is_active: true
          };
        }
      }
      
      console.log('Тренер установлен:', trainerData);
      setTrainer(trainerData);
      
    } catch (err) {
      console.error('Ошибка инициализации:', err);
      setError(err.message || 'Не удалось загрузить приложение');
    } finally {
      setLoading(false);
    }
  };

  // Компоненты состояний
  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} onRetry={initializeApp} />;
  }

  if (!trainer) {
    return <ErrorScreen error="Не удалось загрузить данные тренера" onRetry={initializeApp} />;
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route 
            path="/" 
            element={<Dashboard trainer={trainer} />} 
          />
          <Route 
            path="/clients" 
            element={<Clients trainerId={trainer.id} trainer={trainer} />} 
          />
          <Route 
            path="/workouts" 
            element={<Workouts trainerId={trainer.id} trainer={trainer} />} 
          />
          <Route 
            path="/analytics" 
            element={<Analytics trainerId={trainer.id} trainer={trainer} />} 
          />
          <Route 
            path="/settings" 
            element={<Settings trainer={trainer} setTrainer={setTrainer} />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;