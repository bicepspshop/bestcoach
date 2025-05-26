import React from 'react';

const Settings = ({ trainer, setTrainer }) => {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Настройки</h1>
        <p className="text-gray-500">Управление профилем и параметрами</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Профиль</h3>
        </div>
        <div className="card-body">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">
                {trainer?.first_name?.charAt(0)}{trainer?.last_name?.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {trainer?.first_name} {trainer?.last_name}
              </h3>
              <p className="text-gray-500">Персональный тренер</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Имя</label>
              <input
                type="text"
                value={trainer?.first_name || ''}
                className="form-input"
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="form-label">Фамилия</label>
              <input
                type="text"
                value={trainer?.last_name || ''}
                className="form-input"
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={trainer?.email || ''}
                className="form-input"
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="form-label">Стоимость за час</label>
              <input
                type="number"
                value="3500"
                className="form-input"
                readOnly
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button className="btn btn-primary">
              <span className="mr-2">💾</span>
              Сохранить профиль
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;