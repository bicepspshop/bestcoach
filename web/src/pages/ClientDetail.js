import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar,
  Edit,
  Plus,
  TrendingUp,
  TrendingDown,
  Scale,
  Target,
  Activity
} from 'lucide-react';
import { ApiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const ClientDetail = ({ trainerId }) => {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  const loadClientData = async () => {
    try {
      setLoading(true);
      
      const [clientData, measurementsData, workoutsData] = await Promise.all([
        ApiService.getClient(clientId),
        ApiService.getMeasurements(clientId),
        ApiService.getWorkouts(trainerId, { clientId, limit: 5 })
      ]);
      
      setClient(clientData);
      setMeasurements(measurementsData);
      setRecentWorkouts(workoutsData);
    } catch (error) {
      console.error('Ошибка загрузки данных клиента:', error);
      toast.error('Ошибка загрузки данных клиента');
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    if (!client?.sessions_total || client.sessions_total === 0) return 0;
    return Math.round((client.sessions_used / client.sessions_total) * 100);
  };

  const getWeightProgress = () => {
    if (!client?.initial_weight || !client?.current_weight) return null;
    const diff = client.current_weight - client.initial_weight;
    return {
      value: Math.abs(diff),
      direction: diff < 0 ? 'down' : diff > 0 ? 'up' : 'same',
      percentage: client.target_weight ? 
        Math.round(((client.initial_weight - client.current_weight) / (client.initial_weight - client.target_weight)) * 100) : 0
    };
  };

  const getGoalText = (goal) => {
    const goals = {
      weight_loss: 'Похудение',
      muscle_gain: 'Набор мышечной массы',
      maintenance: 'Поддержание формы',
      strength: 'Увеличение силы',
      endurance: 'Выносливость',
      rehabilitation: 'Реабилитация'
    };
    return goals[goal] || goal;
  };

  const chartData = measurements.slice(-10).reverse().map(m => ({
    date: format(new Date(m.measurement_date), 'dd.MM', { locale: ru }),
    weight: m.weight,
    fullDate: m.measurement_date
  }));

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container py-6">
        <div className="card p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Клиент не найден</h2>
          <p className="text-gray-500 mb-4">Проверьте правильность ссылки</p>
          <Link to="/clients" className="btn btn-primary">
            <ArrowLeft size={20} />
            Вернуться к списку
          </Link>
        </div>
      </div>
    );
  }

  const weightProgress = getWeightProgress();

  return (
    <div className="container py-6 space-y-6">
      {/* Шапка */}
      <div className="flex items-center gap-4">
        <Link to="/clients" className="btn btn-outline">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {client.first_name} {client.last_name}
          </h1>
          <p className="text-gray-500">
            Клиент с {format(new Date(client.created_at), 'dd MMMM yyyy', { locale: ru })}
          </p>
        </div>
        <button className="btn btn-outline">
          <Edit size={20} />
          Редактировать
        </button>
      </div>

      {/* Основная информация */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Контакты */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Контакты</h3>
          </div>
          <div className="card-body space-y-3">
            {client.phone && (
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-400" />
                <span>{client.phone}</span>
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-400" />
                <span>{client.email}</span>
              </div>
            )}
            {client.birth_date && (
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-gray-400" />
                <span>
                  {format(new Date(client.birth_date), 'dd.MM.yyyy', { locale: ru })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Прогресс тренировок */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Абонемент</h3>
          </div>
          <div className="card-body">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold">
                {client.sessions_used}/{client.sessions_total}
              </div>
              <div className="text-sm text-gray-500">тренировок</div>
            </div>
            <div className="progress mb-3">
              <div 
                className="progress-bar"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-gray-600">
              {getProgressPercentage()}% завершено
            </div>
          </div>
        </div>

        {/* Прогресс по весу */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Прогресс</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Текущий вес</span>
                <span className="font-semibold">
                  {client.current_weight ? `${client.current_weight} кг` : 'Не указан'}
                </span>
              </div>
              
              {client.target_weight && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Целевой вес</span>
                  <span className="font-semibold">{client.target_weight} кг</span>
                </div>
              )}
              
              {weightProgress && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Изменение</span>
                  <div className="flex items-center gap-1">
                    {weightProgress.direction === 'down' && (
                      <>
                        <TrendingDown size={16} className="text-green-600" />
                        <span className="text-green-600 font-semibold">
                          -{weightProgress.value} кг
                        </span>
                      </>
                    )}
                    {weightProgress.direction === 'up' && (
                      <>
                        <TrendingUp size={16} className="text-red-600" />
                        <span className="text-red-600 font-semibold">
                          +{weightProgress.value} кг
                        </span>
                      </>
                    )}
                    {weightProgress.direction === 'same' && (
                      <span className="text-gray-600 font-semibold">0 кг</span>
                    )}
                  </div>
                </div>
              )}

              {client.goal && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Цель</span>
                  <span className="font-semibold">{getGoalText(client.goal)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div className="card">
        <div className="card-header border-b-0">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Обзор' },
              { id: 'measurements', label: 'Измерения' },
              { id: 'workouts', label: 'Тренировки' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card-body">
          {/* Вкладка "Обзор" */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* График веса */}
              {chartData.length > 1 && (
                <div>
                  <h4 className="text-lg font-semibold mb-4">Динамика веса</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(value, payload) => {
                            if (payload && payload[0]) {
                              return format(new Date(payload[0].payload.fullDate), 'dd MMMM yyyy', { locale: ru });
                            }
                            return value;
                          }}
                          formatter={(value) => [`${value} кг`, 'Вес']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="#4f46e5" 
                          strokeWidth={2}
                          dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Последние тренировки */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold">Последние тренировки</h4>
                  <Link to="/workouts" className="text-blue-600 text-sm">
                    Все тренировки →
                  </Link>
                </div>
                
                {recentWorkouts.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Тренировок пока нет</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentWorkouts.map(workout => (
                      <div key={workout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{workout.title}</div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(workout.workout_date), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                          </div>
                        </div>
                        <span className={`status ${
                          workout.status === 'completed' ? 'status-success' :
                          workout.status === 'cancelled' ? 'status-danger' :
                          workout.status === 'no_show' ? 'status-warning' : 'status-info'
                        }`}>
                          {workout.status === 'completed' ? 'Завершена' :
                           workout.status === 'cancelled' ? 'Отменена' :
                           workout.status === 'no_show' ? 'Не явился' : 'Запланирована'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Вкладка "Измерения" */}
          {activeTab === 'measurements' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">История измерений</h4>
                <button className="btn btn-primary btn-sm">
                  <Plus size={16} />
                  Добавить
                </button>
              </div>
              
              {measurements.length === 0 ? (
                <div className="text-center py-8">
                  <Scale size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Измерений пока нет</p>
                  <button className="btn btn-primary">
                    <Plus size={16} />
                    Добавить первое измерение
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {measurements.map(measurement => (
                    <div key={measurement.id} className="card p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            {format(new Date(measurement.measurement_date), 'dd MMMM yyyy', { locale: ru })}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Вес: {measurement.weight} кг
                            {measurement.body_fat_percentage && (
                              <span> • Жир: {measurement.body_fat_percentage}%</span>
                            )}
                          </div>
                          {measurement.notes && (
                            <div className="text-sm text-gray-600 mt-2">
                              {measurement.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Вкладка "Тренировки" */}
          {activeTab === 'workouts' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Все тренировки</h4>
                <button className="btn btn-primary btn-sm">
                  <Plus size={16} />
                  Запланировать
                </button>
              </div>
              
              <WorkoutsList clientId={clientId} trainerId={trainerId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Компонент списка тренировок
const WorkoutsList = ({ clientId, trainerId }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const data = await ApiService.getWorkouts(trainerId, { clientId });
        setWorkouts(data);
      } catch (error) {
        console.error('Ошибка загрузки тренировок:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, [clientId, trainerId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Тренировок пока нет</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {workouts.map(workout => (
        <div key={workout.id} className="card p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-medium">{workout.title}</div>
              <div className="text-sm text-gray-500 mt-1">
                {format(new Date(workout.workout_date), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                {workout.duration && <span> • {workout.duration} мин</span>}
                {workout.workout_type && <span> • {workout.workout_type}</span>}
              </div>
              {workout.description && (
                <div className="text-sm text-gray-600 mt-2">
                  {workout.description}
                </div>
              )}
            </div>
            <span className={`status ${
              workout.status === 'completed' ? 'status-success' :
              workout.status === 'cancelled' ? 'status-danger' :
              workout.status === 'no_show' ? 'status-warning' : 'status-info'
            }`}>
              {workout.status === 'completed' ? 'Завершена' :
               workout.status === 'cancelled' ? 'Отменена' :
               workout.status === 'no_show' ? 'Не явился' : 'Запланирована'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientDetail;