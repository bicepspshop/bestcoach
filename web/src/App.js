import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApiService } from './services/api';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Workouts from './pages/Workouts';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';

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
      
      // Получаем данные пользователя из Telegram WebApp
      let telegramId = null;
      
      if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        telegramId = window.Telegram.WebApp.initDataUnsafe.user.id;
      } else {
        // Для тестирования вне Telegram
        const urlParams = new URLSearchParams(window.location.search);
        telegramId = urlParams.get('telegram_id') || '123456789'; // Тестовый ID
      }

      if (!telegramId) {
        throw new Error('Не удалось получить данные пользователя');
      }

      // Получаем данные тренера
      const trainerData = await ApiService.getTrainerByTelegramId(telegramId);
      
      if (!trainerData) {
        // Создаем тестового тренера для демонстрации
        setTrainer({
          id: 'test-trainer-id',
          telegram_id: telegramId,
          first_name: 'Тест',
          last_name: 'Тренер',
          email: 'test@example.com'
        });
      } else {
        setTrainer(trainerData);
      }
      
    } catch (err) {
      console.error('Ошибка инициализации:', err);
      // Для демонстрации создаем тестового тренера
      setTrainer({
        id: 'test-trainer-id',
        telegram_id: '123456789',
        first_name: 'Тест',
        last_name: 'Тренер',
        email: 'test@example.com'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loader"></div>
          <p className="mt-4 text-gray-500">Загрузка приложения...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="card max-w-md w-full mx-4">
          <div className="card-body text-center">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Ошибка загрузки</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={initializeApp}
              className="btn btn-primary"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar trainer={trainer} />
        
        <main className="pb-20">
          <Routes>
            <Route 
              path="/" 
              element={<Dashboard trainer={trainer} />} 
            />
            <Route 
              path="/clients" 
              element={<Clients trainerId={trainer.id} />} 
            />
            <Route 
              path="/workouts" 
              element={<Workouts trainerId={trainer.id} />} 
            />
            <Route 
              path="/analytics" 
              element={<Analytics trainerId={trainer.id} />} 
            />
            <Route 
              path="/settings" 
              element={<Settings trainer={trainer} setTrainer={setTrainer} />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;