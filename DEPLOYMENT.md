# Деплой BestCoach

Подробные инструкции по развертыванию проекта в продакшене.

## 🚀 Быстрый деплой веб-приложения

### Вариант 1: Vercel (Рекомендуется)

**Преимущества:** Автоматический деплой, быстрый CDN, бесплатный план

1. **Создайте аккаунт на [Vercel](https://vercel.com)**

2. **Подключите GitHub репозиторий:**
   - Загрузите проект на GitHub
   - Подключите репозиторий к Vercel
   - Vercel автоматически определит React приложение

3. **Настройте переменные окружения в Vercel:**
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Настройте билд команды:**
   - Build Command: `cd web && npm install && npm run build`
   - Output Directory: `web/build`
   - Install Command: `cd web && npm install`

### Вариант 2: Netlify

**Преимущества:** Простота настройки, хорошая интеграция с Git

1. **Установите Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Билд и деплой:**
   ```bash
   cd web
   npm run build
   netlify login
   netlify deploy --prod --dir=build
   ```

3. **Настройте переменные окружения в панели Netlify**

### Вариант 3: Railway

**Преимущества:** Поддержка полного стека, встроенная база данных

1. **Подключите GitHub репозиторий к [Railway](https://railway.app)**

2. **Railway автоматически деплоит и даст URL**

## 🤖 Деплой Telegram бота

### Вариант 1: VPS/Dedicated Server

**Рекомендуется для продакшена**

1. **Подключитесь к серверу:**
   ```bash
   ssh user@your-server.com
   ```

2. **Установите зависимости:**
   ```bash
   # Установка Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Установка PM2
   npm install -g pm2
   ```

3. **Загрузите проект:**
   ```bash
   git clone https://github.com/yourusername/bestcoach.git
   cd bestcoach
   npm install
   ```

4. **Настройте .env файл:**
   ```bash
   cp .env.example .env
   nano .env
   ```

5. **Запустите с PM2:**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Вариант 2: Railway/Heroku

**Простой деплой в облаке**

1. **Создайте Procfile:**
   ```
   web: node bot/index.js
   ```

2. **Настройте переменные окружения в панели управления**

3. **Деплой через Git:**
   ```bash
   git add .
   git commit -m "Deploy to Railway"
   git push railway main
   ```

## 📋 Чек-лист после деплоя

### ✅ Проверьте веб-приложение:
- [ ] Открывается ли сайт по URL
- [ ] Работает ли навигация между страницами
- [ ] Загружаются ли данные из Supabase
- [ ] Корректно ли отображается интерфейс

### ✅ Проверьте Telegram бота:
- [ ] Отвечает ли бот на команду `/start`
- [ ] Открывается ли веб-панель из бота
- [ ] Корректно ли работают callback кнопки
- [ ] Сохраняются ли данные в базу

### ✅ Проверьте базу данных:
- [ ] Созданы ли все таблицы
- [ ] Работают ли права доступа
- [ ] Создаются ли записи тренеров

## 🔧 Настройка переменных окружения

### Для бота (.env в корне):
```env
TELEGRAM_BOT_TOKEN=your_bot_token
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
WEB_APP_URL=https://your-deployed-app.vercel.app
PORT=3000
NODE_ENV=production
```

### Для веб-приложения (в настройках хостинга):
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

## 🔄 Автоматический деплой

### GitHub Actions для Vercel:

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 🐛 Отладка проблем

### Проблема: Бот не отвечает
**Решение:**
1. Проверьте правильность TELEGRAM_BOT_TOKEN
2. Убедитесь, что бот запущен на сервере
3. Проверьте логи: `pm2 logs`

### Проблема: Веб-панель не открывается
**Решение:**
1. Проверьте правильность WEB_APP_URL в .env
2. Убедитесь, что сайт доступен по HTTPS
3. Проверьте настройки домена Telegram WebApp

### Проблема: База данных не работает
**Решение:**
1. Проверьте правильность Supabase URL и ключей
2. Убедитесь, что таблицы созданы
3. Проверьте RLS (Row Level Security) политики

## 📞 Поддержка

При возникновении проблем с деплоем:
1. Проверьте логи сервера
2. Убедитесь в корректности всех переменных окружения
3. Проверьте статус всех сервисов

---

✨ **Готово!** Ваш BestCoach теперь работает в продакшене