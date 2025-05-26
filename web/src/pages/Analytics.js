import React from 'react';

const Analytics = ({ trainerId }) => {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Аналитика</h1>
          <p className="text-gray-500">Анализ эффективности и прогресса</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Общий доход</p>
              <p className="text-2xl font-bold">127,500 ₽</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <span>📈</span>
                <span>+12%</span>
              </div>
            </div>
            <div className="ml-3">
              <span className="text-green-600 text-2xl">💰</span>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Активные клиенты</p>
              <p className="text-2xl font-bold">12</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <span>📈</span>
                <span>+3</span>
              </div>
            </div>
            <div className="ml-3">
              <span className="text-blue-600 text-2xl">👥</span>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Тренировки</p>
              <p className="text-2xl font-bold">45</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <span>📈</span>
                <span>+8</span>
              </div>
            </div>
            <div className="ml-3">
              <span className="text-purple-600 text-2xl">📅</span>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Эффективность</p>
              <p className="text-2xl font-bold">85%</p>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <span>📈</span>
                <span>+5%</span>
              </div>
            </div>
            <div className="ml-3">
              <span className="text-orange-600 text-2xl">🎯</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Динамика доходов</h3>
        </div>
        <div className="card-body">
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <span className="text-4xl">📊</span>
              <p className="mt-2">График будет здесь</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;