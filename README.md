# BestCoach - Фитнес Помощник 🏋️‍♂️

Telegram бот и веб-приложение для фитнес-тренеров с полным функционалом управления клиентами, тренировками и аналитикой.

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+ 
- npm или yarn
- Telegram Bot Token
- Supabase аккаунт

### Установка

1. **Клонируйте репозиторий:**
```bash
git clone https://github.com/yourusername/bestcoach.git
cd bestcoach
```

2. **Установите зависимости:**
```bash
npm install
cd web && npm install && cd ..
```

3. **Настройте переменные окружения:**

Создайте файл `.env` в корне проекта:
```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
WEB_APP_URL=https://your-deployed-app.vercel.app
PORT=3000
NODE_ENV=production
```

4. **Настройте базу данных:**
```bash
npm run setup-db
```

5. **Запустите бота:**
```bash
npm start
```

## 🌐 Деплой веб-приложения

### Vercel (Рекомендуется)

1. **Установите Vercel CLI:**
```bash
npm i -g vercel
```

2. **Деплой веб-приложения:**
```bash
cd web
vercel
```

3. **Добавьте переменные окружения в Vercel:**
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

### Netlify

1. **Установите Netlify CLI:**
```bash
npm i -g netlify-cli
```

2. **Билд и деплой:**
```bash
cd web
npm run build
netlify deploy --prod --dir=build
```

## 📁 Структура проекта

```
bestcoach/
├── bot/                    # Telegram бот
│   ├── index.js           # Основной файл бота
│   ├── keyboards.js       # Клавиатуры
│   └── services/          # Сервисы
├── web/                   # React веб-приложение
│   ├── public/           # Статические файлы
│   ├── src/              # Исходный код
│   │   ├── components/   # Компоненты
│   │   ├── pages/        # Страницы
│   │   └── services/     # API сервисы
├── database/             # Схема БД
├── package.json          # Зависимости проекта
└── README.md            # Документация
```

## ✨ Функционал

### Для тренеров:
- 👥 Управление клиентами
- 📅 Планирование тренировок  
- 📊 Отслеживание прогресса
- 💰 Финансовый учет
- 📈 Аналитика и отчеты
- 🔔 Система уведомлений

### Для клиентов:
- 📱 Telegram интерфейс
- 📋 Просмотр программы тренировок
- 📅 Запись на занятия
- 📊 Отслеживание прогресса
- 💬 Чат с тренером

## 🛠️ Технологии

- **Backend:** Node.js, Express.js, Telegram Bot API
- **Frontend:** React, React Router
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel/Netlify + PM2

## 📝 API Документация

Подробная документация API доступна в файле [API.md](./API.md)

## 🚀 Деплой

Подробные инструкции по развертыванию в файле [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте feature ветку (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Запушьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для подробностей.

## 📞 Поддержка

- Telegram: [@your_username](https://t.me/your_username)
- Email: support@bestcoach.app

---

Сделано с ❤️ командой BestCoach