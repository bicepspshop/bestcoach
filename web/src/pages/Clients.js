import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

const Clients = ({ trainerId }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    goal: ''
  });

  useEffect(() => {
    loadClients();
  }, [trainerId]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getClients(trainerId);
      setClients(data);
    } catch (error) {
      console.error('Ошибка загрузки клиентов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const clientData = {
        ...newClient,
        trainer_id: trainerId
      };
      
      await ApiService.createClient(clientData);
      setNewClient({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        goal: ''
      });
      setShowAddForm(false);
      loadClients();
    } catch (error) {
      console.error('Ошибка создания клиента:', error);
      alert('Ошибка при создании клиента');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex justify-center">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Клиенты</h1>
          <p className="text-gray-500">Управление клиентской базой</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <span className="mr-2">+</span>
          Добавить
        </button>
      </div>

      {showAddForm && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Добавить клиента</h3>
          </div>
          <form onSubmit={handleAddClient} className="card-body space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Имя *</label>
                <input
                  type="text"
                  name="first_name"
                  value={newClient.first_name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Фамилия</label>
                <input
                  type="text"
                  name="last_name"
                  value={newClient.last_name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Телефон</label>
                <input
                  type="tel"
                  name="phone"
                  value={newClient.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newClient.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="client@example.com"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Цель тренировок</label>
              <textarea
                name="goal"
                value={newClient.goal}
                onChange={handleInputChange}
                className="form-input form-textarea"
                placeholder="Опишите цель тренировок..."
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="btn btn-primary">
                Создать клиента
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="btn btn-outline"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {clients.length === 0 && !showAddForm ? (
        <div className="card p-8 text-center">
          <span className="text-gray-300 text-4xl">👥</span>
          <h3 className="text-lg font-medium mb-2 mt-4">Нет клиентов</h3>
          <p className="text-gray-500 mb-4">
            Добавьте первого клиента для начала работы
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <span className="mr-2">+</span>
            Добавить клиента
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map(client => (
            <div key={client.id} className="card">
              <div className="card-body">
                <h3 className="font-semibold text-lg">
                  {client.first_name} {client.last_name}
                </h3>
                {client.phone && (
                  <p className="text-gray-500">📞 {client.phone}</p>
                )}
                {client.email && (
                  <p className="text-gray-500">✉️ {client.email}</p>
                )}
                {client.goal && (
                  <p className="text-sm text-gray-600 mt-2">🎯 {client.goal}</p>
                )}
                <div className="mt-4 flex gap-2">
                  <button className="btn btn-outline text-sm">
                    Редактировать
                  </button>
                  <button className="btn btn-secondary text-sm">
                    Тренировки
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Clients;