@echo off
echo 🚀 Подготовка к загрузке на GitHub...

echo.
echo 📁 Инициализация Git репозитория...
git init

echo.
echo 📦 Добавление файлов в Git...
git add .

echo.
echo 💾 Создание коммита...
git commit -m "Initial commit: BestCoach fitness assistant"

echo.
echo ✅ Готово! Теперь:
echo 1. Создайте репозиторий на GitHub
echo 2. Выполните команды:
echo.
echo git remote add origin https://github.com/ВАШ_USERNAME/bestcoach.git
echo git branch -M main
echo git push -u origin main
echo.
echo 📖 Подробная инструкция в файле GITHUB_SETUP.md

pause