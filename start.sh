#!/bin/bash

# Скрипт для запуска BestCoach фитнес-помощника

echo "🚀 Запуск BestCoach..."

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js версии 16 или выше."
    exit 1
fi

# Проверяем наличие npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен. Установите npm."
    exit 1
fi

# Проверяем файл .env
if [ ! -f ".env" ]; then
    echo "⚠️  Файл .env не найден. Создайте файл .env на основе .env.example"
    echo "📝 Не забудьте указать ваш TELEGRAM_BOT_TOKEN"
    exit 1
fi

# Устанавливаем зависимости, если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости..."
    npm install
fi

# Настраиваем базу данных
echo "🗄️  Настраиваем базу данных..."
npm run setup-db

# Запускаем бота
echo "🤖 Запускаем Telegram бота..."
npm start &

# Ждем немного, чтобы бот запустился
sleep 3

# Запускаем веб-приложение
echo "🌐 Запускаем веб-приложение..."
cd web && npm install && npm start &

echo ""
echo "✅ BestCoach запущен!"
echo ""
echo "📱 Telegram бот: активен"
echo "🌐 Веб-приложение: http://localhost:3000"
echo ""
echo "💡 Для остановки нажмите Ctrl+C"

# Ждем завершения
wait