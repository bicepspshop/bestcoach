const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { supabase } = require('./services/database');

// Инициализация бота
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Проверяем наличие build папки, если нет - используем dev режим
const buildPath = path.join(__dirname, '../web/build');
const fs = require('fs');

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
} else {
  console.log('⚠️ Build папка не найдена. Запустите "npm run build" в папке web для продакшена');
}

// Хранилище состояний пользователей
const userStates = new Map();

// URL веб-приложения из переменных окружения
const WEB_APP_URL = process.env.WEB_APP_URL || 'http://localhost:3000';

// Команды бота
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  try {
    // Упрощенная проверка/создание тренера
    let trainer = await getOrCreateTrainer(userId, msg.from);
    
    const welcomeMessage = `
🏋️‍♂️ *Добро пожаловать в BestCoach!*

Привет, ${trainer.first_name}! Я твой персональный помощник для работы с клиентами.

*Что я умею:*
• 👥 Управлять базой клиентов
• 📅 Планировать тренировки
• 📊 Отслеживать прогресс
• 💰 Вести финансовый учет
• 📈 Показывать аналитику
• 🔔 Отправлять напоминания

*Быстрый старт:*
1. Добавьте первого клиента
2. Запланируйте тренировку
3. Откройте веб-панель для детальной работы

Выберите действие:
    `;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '👥 Клиенты', callback_data: 'view_clients' },
          { text: '📅 Тренировки', callback_data: 'schedule_workout' }
        ],
        [
          { text: '📊 Аналитика', callback_data: 'analytics' },
          { text: '⚙️ Настройки', callback_data: 'settings' }
        ],
        [
          { text: '🌐 Открыть веб-панель', web_app: { url: WEB_APP_URL } }
        ]
      ]
    };

    await bot.sendMessage(chatId, welcomeMessage, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });

  } catch (error) {
    console.error('Ошибка в /start:', error);
    await bot.sendMessage(chatId, '❌ Произошла ошибка при запуске. Попробуйте еще раз через несколько секунд.');
  }
});

// Упрощенная функция получения/создания тренера
async function getOrCreateTrainer(telegramId, userInfo) {
  try {
    // Сначала пытаемся найти существующего тренера
    const { data: existingTrainer, error: findError } = await supabase
      .from('trainers')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (existingTrainer) {
      return existingTrainer;
    }

    // Создаем нового тренера с минимальными данными
    const { data: newTrainer, error: createError } = await supabase
      .from('trainers')
      .insert([{
        telegram_id: telegramId,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name || null,
        username: userInfo.username || null,
        is_active: true
      }])
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    return newTrainer;

  } catch (error) {
    console.error('Ошибка работы с тренером:', error);
    // Возвращаем минимальный объект для продолжения работы
    return {
      id: `temp_${telegramId}`,
      telegram_id: telegramId,
      first_name: userInfo.first_name || 'Тренер',
      last_name: userInfo.last_name || '',
      is_active: true
    };
  }
}

// Обработка callback запросов
bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const data = callbackQuery.data;

  try {
    await bot.answerCallbackQuery(callbackQuery.id);

    switch (data) {
      case 'view_clients':
        await bot.sendMessage(chatId, '👥 *Ваши клиенты*\n\nПока что клиенты не добавлены.\nИспользуйте веб-панель для управления клиентами.', {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🌐 Открыть веб-панель', web_app: { url: `${WEB_APP_URL}/clients` } }],
              [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
            ]
          }
        });
        break;
      
      case 'schedule_workout':
        await bot.sendMessage(chatId, '📅 *Планирование тренировки*\n\nДля полного функционала используйте веб-панель.', {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🌐 Открыть веб-панель', web_app: { url: `${WEB_APP_URL}/workouts` } }],
              [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
            ]
          }
        });
        break;
      
      case 'analytics':
        await bot.sendMessage(chatId, '📊 *Аналитика*\n\nВаша статистика:\n• Клиенты: 0\n• Тренировки: 0\n• Доход: 0 ₽', {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🌐 Детальная аналитика', web_app: { url: `${WEB_APP_URL}/analytics` } }],
              [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
            ]
          }
        });
        break;

      case 'settings':
        await bot.sendMessage(chatId, '⚙️ *Настройки*\n\nДля настройки профиля и параметров используйте веб-панель.', {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🌐 Открыть настройки', web_app: { url: `${WEB_APP_URL}/settings` } }],
              [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
            ]
          }
        });
        break;

      case 'main_menu':
        // Повторно отправляем главное меню
        await bot.sendMessage(chatId, '🏠 *Главное меню*\n\nВыберите действие:', {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '👥 Клиенты', callback_data: 'view_clients' },
                { text: '📅 Тренировки', callback_data: 'schedule_workout' }
              ],
              [
                { text: '📊 Аналитика', callback_data: 'analytics' },
                { text: '⚙️ Настройки', callback_data: 'settings' }
              ],
              [
                { text: '🌐 Открыть веб-панель', web_app: { url: WEB_APP_URL } }
              ]
            ]
          }
        });
        break;
    }

  } catch (error) {
    console.error('Ошибка в callback_query:', error);
    await bot.sendMessage(chatId, '❌ Произошла ошибка. Попробуйте еще раз.');
  }
});

// Web сервер для API
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Обработка всех остальных маршрутов
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../web/build/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({ 
      message: 'BestCoach API активно', 
      webApp: 'http://localhost:3000',
      note: 'Для веб-интерфейса запустите: cd web && npm start'
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 BestCoach Bot запущен!`);
  console.log(`📱 Telegram Bot: активен`);
  console.log(`🌐 Web App: http://localhost:3000`);
  console.log(`🗄️ Database: подключена`);
  console.log(`🔗 API: http://localhost:${PORT}`);
});

// Обработка ошибок
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

module.exports = { bot, app };