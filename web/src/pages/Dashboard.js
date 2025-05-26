import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

const Dashboard = ({ trainer }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [trainer.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await ApiService.getTrainerStats(trainer.id);
      setStats(statsData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center py-12">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Заголовок */}
      <div className="">
        <h1 className="text-2xl font-bold mb-2">Главная панель</h1>
        <p className="text-gray-500">
          Добро пожаловать в фитнес-помощник!
        </p>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 text-center hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-blue-600 text-2xl">+</span>
            </div>
            <span className="font-medium">Добавить клиента</span>
          </div>
        </div>
        
        <div className="card p-4 text-center hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-green-600 text-2xl">📅</span>
            </div>
            <span className="font-medium">Запланировать тренировку</span>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Клиенты</p>
              <p className="text-2xl font-bold">{stats?.activeClients || 0}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600">👥</span>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Аналитика</p>
              <p className="text-2xl font-bold">{stats?.completionRate || 0}%</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Расписание на сегодня */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">Расписание на сегодня</h2>
        </div>
        <div className="card-body">
          <div className="text-center py-8">
            <span className="text-gray-300 text-4xl">📅</span>
            <p className="text-gray-500 mt-4">На сегодня тренировок не запланировано</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;