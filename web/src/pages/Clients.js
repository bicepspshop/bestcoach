import React from 'react';

const Clients = ({ trainerId }) => {
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Клиенты</h1>
          <p className="text-gray-500">Управление клиентской базой</p>
        </div>
        <button className="btn btn-primary">
          <span className="mr-2">+</span>
          Добавить
        </button>
      </div>

      <div className="card p-8 text-center">
        <span className="text-gray-300 text-4xl">👥</span>
        <h3 className="text-lg font-medium mb-2 mt-4">Нет клиентов</h3>
        <p className="text-gray-500 mb-4">
          Добавьте первого клиента для начала работы
        </p>
        <button className="btn btn-primary">
          <span className="mr-2">+</span>
          Добавить клиента
        </button>
      </div>
    </div>
  );
};

export default Clients;