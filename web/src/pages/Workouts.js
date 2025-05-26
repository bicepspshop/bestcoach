import React from 'react';

const Workouts = ({ trainerId }) => {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Тренировки</h1>
          <p className="text-gray-500">Управление расписанием</p>
        </div>
        <button className="btn btn-primary">
          <span className="mr-2">+</span>
          Запланировать
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">0</div>
          <div className="text-sm text-gray-500">Запланировано</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">0</div>
          <div className="text-sm text-gray-500">Завершено</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">0</div>
          <div className="text-sm text-gray-500">Отменено</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">0</div>
          <div className="text-sm text-gray-500">Не явились</div>
        </div>
      </div>

      <div className="card p-8 text-center">
        <span className="text-gray-300 text-4xl">📅</span>
        <h3 className="text-lg font-medium mb-2 mt-4">Тренировок не найдено</h3>
        <p className="text-gray-500">На выбранную неделю тренировки не запланированы</p>
      </div>
    </div>
  );
};

export default Workouts;