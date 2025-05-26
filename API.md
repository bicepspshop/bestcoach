# 📚 API Документация BestCoach

## Обзор

BestCoach предоставляет REST API для интеграции с веб-приложением и внешними сервисами.

## Базовый URL
```
http://localhost:3000/api  # Разработка
https://your-domain.com/api  # Продакшен
```

## Аутентификация

API использует Supabase Authentication. Все запросы должны содержать заголовок:
```
Authorization: Bearer <supabase_jwt_token>
```

## Endpoints

### Тренеры

#### GET /api/trainer/:telegramId
Получить данные тренера по Telegram ID

**Параметры:**
- `telegramId` - ID пользователя в Telegram

**Ответ:**
```json
{
  "id": "uuid",
  "telegram_id": 123456789,
  "first_name": "Иван",
  "last_name": "Петров",
  "phone": "+7 999 123-45-67",
  "email": "ivan@example.com",
  "specialization": "Силовые тренировки",
  "experience_years": 5,
  "hourly_rate": 3500,
  "currency": "RUB",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Клиенты

#### GET /api/trainer/:trainerId/clients
Получить всех клиентов тренера

**Ответ:**
```json
[
  {
    "id": "uuid",
    "trainer_id": "uuid",
    "first_name": "Анна",
    "last_name": "Иванова",
    "phone": "+7 999 987-65-43",
    "current_weight": 65.5,
    "target_weight": 60.0,
    "sessions_total": 12,
    "sessions_used": 8,
    "is_active": true
  }
]
```

### Тренировки

#### GET /api/trainer/:trainerId/workouts
Получить тренировки тренера

**Ответ:**
```json
[
  {
    "id": "uuid",
    "trainer_id": "uuid", 
    "client_id": "uuid",
    "title": "Силовая тренировка",
    "workout_date": "2024-01-15T10:00:00.000Z",
    "duration": 60,
    "status": "scheduled",
    "clients": {
      "first_name": "Анна",
      "last_name": "Иванова"
    }
  }
]
```

## Статистика

#### GET /api/trainer/:trainerId/stats

**Ответ:**
```json
{
  "totalClients": 15,
  "activeClients": 12,
  "monthlyWorkouts": 45,
  "completedWorkouts": 38,
  "monthlyRevenue": 127500,
  "averagePayment": 3500,
  "completionRate": 85
}
```

---

**Версия API: v1.0**