import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

const Dashboard = ({ trainer }) => {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    monthlyWorkouts: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (trainer?.id) {
      loadDashboardData();
    }
  }, [trainer]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await ApiService.getTrainerStats(trainer.id);
      setStats(statsData);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
      // Показываем тестовые данные в случае ошибки
      setStats({
        totalClients: 0,
        activeClients: 0,
        monthlyWorkouts: 0,
        monthlyRevenue: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="content-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <div className="loading-text">Загрузка панели...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="content-container fade-in">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="page-title">
            Добро пожаловать, {trainer?.first_name || 'Тренер'}! 👋
          </h1>
          <p className="page-subtitle">
            Управляйте своими клиентами и тренировками
          </p>
        </div>

        {/* Статистика */}
        <div className="stats-grid">
          <div className="stat-card slide-up">
            <div className="stat-icon primary">👥</div>
            <div className="stat-value">{stats.totalClients}</div>
            <div className="stat-label">Всего клиентов</div>
          </div>
          
          <div className="stat-card slide-up">
            <div className="stat-icon success">🏋️</div>
            <div className="stat-value">{stats.monthlyWorkouts}</div>
            <div className="stat-label">Тренировок в месяц</div>
          </div>
          
          <div className="stat-card slide-up">
            <div className="stat-icon warning">💰</div>
            <div className="stat-value">{stats.monthlyRevenue.toLocaleString()}₽</div>
            <div className="stat-label">Доход за месяц</div>
          </div>
          
          <div className="stat-card slide-up">
            <div className="stat-icon info">📅</div>
            <div className="stat-value">{new Date().getDate()}</div>
            <div className="stat-label">Сегодня</div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="card card-gradient">
          <div className="card-header">
            <h2 className="section-title">Быстрые действия</h2>
          </div>
          <div className="card-body">
            <div className="quick-actions">
              <button 
                className="action-card"
                onClick={() => window.location.hash = '#/clients'}
              >
                <span className="action-icon">👤</span>
                <div className="action-title">Добавить клиента</div>
              </button>
              
              <button 
                className="action-card"
                onClick={() => window.location.hash = '#/workouts'}
              >
                <span className="action-icon">📅</span>
                <div className="action-title">Запланировать тренировку</div>
              </button>
            </div>
            
            <button 
              className="btn btn-primary btn-full btn-lg"
              onClick={() => window.location.hash = '#/clients'}
            >
              <span>🚀</span>
              Начать работу
            </button>
          </div>
        </div>

        {/* Последние клиенты */}
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h2 className="section-title">Последние клиенты</h2>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => window.location.hash = '#/clients'}
              >
                Все клиенты
              </button>
            </div>
          </div>
          <div className="card-body">
            {stats.totalClients === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <div className="empty-title">Пока нет клиентов</div>
                <div className="empty-description">
                  Добавьте первого клиента для начала работы
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.hash = '#/clients'}
                >
                  Добавить клиента
                </button>
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="text-gray-600">Клиенты будут отображаться здесь</p>
              </div>
            )}
          </div>
        </div>

        {/* Сегодняшние тренировки */}
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h2 className="section-title">Тренировки сегодня</h2>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => window.location.hash = '#/workouts'}
              >
                Все тренировки
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <div className="empty-title">Нет тренировок на сегодня</div>
              <div className="empty-description">
                Запланируйте тренировки с клиентами
              </div>
              <button 
                className="btn btn-success"
                onClick={() => window.location.hash = '#/workouts'}
              >
                Запланировать тренировку
              </button>
            </div>
          </div>
        </div>

        {/* Нижний отступ для навигации */}
        <div style={{ height: '80px' }}></div>
      </div>
    </div>
  );
};

export default Dashboard;