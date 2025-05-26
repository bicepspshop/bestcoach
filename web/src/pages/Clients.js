import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

const Clients = ({ trainerId, trainer }) => {
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (trainerId) {
      loadClients();
    }
  }, [trainerId]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getClients(trainerId);
      setClients(data || []);
    } catch (error) {
      console.error('Ошибка загрузки клиентов:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!newClient.first_name.trim()) {
      alert('Введите имя клиента');
      return;
    }

    try {
      setSaving(true);
      const clientData = {
        ...newClient,
        trainer_id: trainerId
      };
      
      await ApiService.createClient(clientData);
      
      // Сброс формы
      setNewClient({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        goal: ''
      });
      setShowAddForm(false);
      
      // Перезагрузка списка клиентов
      await loadClients();
      
    } catch (error) {
      console.error('Ошибка создания клиента:', error);
      alert('Ошибка при создании клиента. Попробуйте еще раз.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getClientInitials = (client) => {
    const first = client.first_name?.charAt(0) || '';
    const last = client.last_name?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="content-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <div className="loading-text">Загрузка клиентов...</div>
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
          <h1 className="page-title">Клиенты 👥</h1>
          <p className="page-subtitle">
            Управление базой клиентов ({clients.length})
          </p>
        </div>

        {/* Кнопка добавления */}
        <div className="mb-6">
          <button 
            className="btn btn-primary btn-full btn-lg"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <span>{showAddForm ? '❌' : '➕'}</span>
            {showAddForm ? 'Отменить' : 'Добавить клиента'}
          </button>
        </div>

        {/* Форма добавления */}
        {showAddForm && (
          <div className="card slide-up">
            <div className="card-header">
              <h3 className="section-title">Новый клиент</h3>
            </div>
            <form onSubmit={handleAddClient} className="card-body">
              <div className="form-group">
                <label className="form-label">Имя *</label>
                <input
                  type="text"
                  name="first_name"
                  value={newClient.first_name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Введите имя"
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
                  placeholder="Введите фамилию"
                />
              </div>
              
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
              
              <div className="form-group">
                <label className="form-label">Цель тренировок</label>
                <textarea
                  name="goal"
                  value={newClient.goal}
                  onChange={handleInputChange}
                  className="form-input form-textarea"
                  placeholder="Опишите цель клиента..."
                  rows="3"
                />
              </div>
              
              <div className="flex" style={{ gap: '12px' }}>
                <button 
                  type="submit" 
                  className="btn btn-success btn-full"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      Сохранить
                    </>
                  )}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-outline"
                  disabled={saving}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Список клиентов */}
        {clients.length === 0 ? (
          <div className="card">
            <div className="card-body">
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <div className="empty-title">Нет клиентов</div>
                <div className="empty-description">
                  Добавьте первого клиента для начала работы с тренировками
                </div>
                {!showAddForm && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(true)}
                  >
                    <span>➕</span>
                    Добавить первого клиента
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="client-grid">
            {clients.map((client, index) => (
              <div key={client.id} className="client-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="client-header">
                  <div className="client-avatar">
                    {getClientInitials(client)}
                  </div>
                  <div className="client-info">
                    <h3>{client.first_name} {client.last_name}</h3>
                    <p>Клиент с {new Date(client.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {(client.phone || client.email || client.goal) && (
                  <div style={{ marginBottom: '16px' }}>
                    {client.phone && (
                      <p style={{ fontSize: '14px', color: 'var(--gray-600)', marginBottom: '4px' }}>
                        📞 {client.phone}
                      </p>
                    )}
                    {client.email && (
                      <p style={{ fontSize: '14px', color: 'var(--gray-600)', marginBottom: '4px' }}>
                        ✉️ {client.email}
                      </p>
                    )}
                    {client.goal && (
                      <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginTop: '8px' }}>
                        🎯 {client.goal}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="client-actions">
                  <button className="btn btn-outline btn-sm">
                    📝 Редактировать
                  </button>
                  <button className="btn btn-success btn-sm">
                    🏋️ Тренировки
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Нижний отступ для навигации */}
        <div style={{ height: '80px' }}></div>
      </div>
    </div>
  );
};

export default Clients;