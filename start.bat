@echo off
REM Скрипт для запуска BestCoach на Windows

echo 🚀 Запуск BestCoach...

REM Проверяем наличие Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js не установлен. Установите Node.js версии 16 или выше.
    pause
    exit /b 1
)

REM Проверяем наличие npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm не установлен. Установите npm.
    pause
    exit /b 1
)

REM Проверяем файл .env
if not exist ".env" (
    echo ⚠️  Файл .env не найден. Создайте файл .env на основе .env.example
    echo 📝 Не забудьте указать ваш TELEGRAM_BOT_TOKEN
    pause
    exit /b 1
)

REM Устанавливаем зависимости, если нужно
if not exist "node_modules" (
    echo 📦 Устанавливаем зависимости...
    npm install
)

REM Настраиваем базу данных
echo 🗄️  Настраиваем базу данных...
npm run setup-db

REM Запускаем бота
echo 🤖 Запускаем Telegram бота...
start "BestCoach Bot" cmd /k npm start

REM Ждем немного
timeout /t 3 /nobreak >nul

REM Запускаем веб-приложение
echo 🌐 Запускаем веб-приложение...
cd web
npm install
start "BestCoach Web" cmd /k npm start

echo.
echo ✅ BestCoach запущен!
echo.
echo 📱 Telegram бот: активен
echo 🌐 Веб-приложение: http://localhost:3000
echo.
echo 💡 Для остановки закройте окна терминала

pause