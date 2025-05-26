// Основные клавиатуры для Telegram бота

const mainMenu = {
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
      { text: '🌐 Открыть веб-панель', callback_data: 'open_webapp' }
    ]
  ]
};

const addClientButton = {
  inline_keyboard: [
    [{ text: '➕ Добавить клиента', callback_data: 'add_client' }],
    [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
  ]
};

const clientActionsMenu = (clientId) => ({
  inline_keyboard: [
    [
      { text: '📅 Запланировать тренировку', callback_data: `workout_schedule_${clientId}` },
      { text: '📊 Прогресс', callback_data: `client_progress_${clientId}` }
    ],
    [
      { text: '📏 Добавить измерения', callback_data: `client_measurements_${clientId}` },
      { text: '💰 Платежи', callback_data: `client_payments_${clientId}` }
    ],
    [
      { text: '✏️ Редактировать', callback_data: `client_edit_${clientId}` },
      { text: '📱 Открыть в веб-панели', web_app: { url: `${process.env.WEB_APP_URL}?client=${clientId}` } }
    ],
    [
      { text: '◀️ Назад к списку', callback_data: 'view_clients' },
      { text: '🏠 Главное меню', callback_data: 'main_menu' }
    ]
  ]
});

const workoutStatusMenu = (workoutId) => ({
  inline_keyboard: [
    [
      { text: '✅ Проведена', callback_data: `workout_complete_${workoutId}` },
      { text: '❌ Отменить', callback_data: `workout_cancel_${workoutId}` }
    ],
    [
      { text: '🚫 Неявка', callback_data: `workout_noshow_${workoutId}` },
      { text: '✏️ Редактировать', callback_data: `workout_edit_${workoutId}` }
    ],
    [
      { text: '📋 Упражнения', callback_data: `workout_exercises_${workoutId}` },
      { text: '📱 Открыть в веб-панели', web_app: { url: `${process.env.WEB_APP_URL}?workout=${workoutId}` } }
    ],
    [
      { text: '◀️ Назад', callback_data: 'schedule_workout' },
      { text: '🏠 Главное меню', callback_data: 'main_menu' }
    ]
  ]
});

const settingsMenu = {
  inline_keyboard: [
    [
      { text: '⏰ Рабочее время', callback_data: 'settings_hours' },
      { text: '💰 Цены', callback_data: 'settings_prices' }
    ],
    [
      { text: '🔔 Уведомления', callback_data: 'settings_notifications' },
      { text: '📞 Контакты', callback_data: 'settings_contacts' }
    ],
    [
      { text: '📱 Открыть настройки в веб-панели', web_app: { url: `${process.env.WEB_APP_URL}?page=settings` } }
    ],
    [
      { text: '🏠 Главное меню', callback_data: 'main_menu' }
    ]
  ]
};

const confirmMenu = (action, itemId) => ({
  inline_keyboard: [
    [
      { text: '✅ Подтвердить', callback_data: `confirm_${action}_${itemId}` },
      { text: '❌ Отмена', callback_data: 'cancel_action' }
    ]
  ]
});

const backToMainMenu = {
  inline_keyboard: [
    [{ text: '🏠 Главное меню', callback_data: 'main_menu' }]
  ]
};

const skipButton = (action) => ({
  inline_keyboard: [
    [{ text: '⏭️ Пропустить', callback_data: `skip_${action}` }]
  ]
});

const yesNoMenu = (yesAction, noAction) => ({
  inline_keyboard: [
    [
      { text: '✅ Да', callback_data: yesAction },
      { text: '❌ Нет', callback_data: noAction }
    ]
  ]
});

const workoutTypeMenu = {
  inline_keyboard: [
    [
      { text: '💪 Силовая', callback_data: 'workout_type_strength' },
      { text: '🏃 Кардио', callback_data: 'workout_type_cardio' }
    ],
    [
      { text: '🤸 Функциональная', callback_data: 'workout_type_functional' },
      { text: '🧘 Растяжка', callback_data: 'workout_type_stretching' }
    ],
    [
      { text: '🥊 Бокс', callback_data: 'workout_type_boxing' },
      { text: '⚡ Смешанная', callback_data: 'workout_type_mixed' }
    ]
  ]
};

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];

const generateTimeSlotMenu = (date) => {
  const keyboard = [];
  for (let i = 0; i < timeSlots.length; i += 2) {
    const row = [];
    row.push({ text: timeSlots[i], callback_data: `time_${date}_${timeSlots[i]}` });
    if (timeSlots[i + 1]) {
      row.push({ text: timeSlots[i + 1], callback_data: `time_${date}_${timeSlots[i + 1]}` });
    }
    keyboard.push(row);
  }
  keyboard.push([{ text: '◀️ Назад', callback_data: 'back_to_date' }]);
  return { inline_keyboard: keyboard };
};

const generateDateMenu = (daysAhead = 14) => {
  const keyboard = [];
  const today = new Date();
  
  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dateStr = date.toISOString().split('T')[0];
    const displayDate = date.toLocaleDateString('ru-RU', { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit' 
    });
    
    if (i % 2 === 0) {
      keyboard.push([{ text: displayDate, callback_data: `date_${dateStr}` }]);
    } else {
      keyboard[keyboard.length - 1].push({ text: displayDate, callback_data: `date_${dateStr}` });
    }
  }
  
  keyboard.push([{ text: '◀️ Назад', callback_data: 'schedule_workout' }]);
  return { inline_keyboard: keyboard };
};

const subscriptionTypeMenu = {
  inline_keyboard: [
    [
      { text: '🔥 Разовая', callback_data: 'sub_single' },
      { text: '📦 8 тренировок', callback_data: 'sub_8' }
    ],
    [
      { text: '📦 12 тренировок', callback_data: 'sub_12' },
      { text: '📦 16 тренировок', callback_data: 'sub_16' }
    ],
    [
      { text: '♾️ Безлимит', callback_data: 'sub_unlimited' },
      { text: '⏭️ Пропустить', callback_data: 'skip_subscription' }
    ]
  ]
};

const measurementTypeMenu = {
  inline_keyboard: [
    [
      { text: '⚖️ Только вес', callback_data: 'measure_weight' },
      { text: '📏 Все замеры', callback_data: 'measure_all' }
    ],
    [
      { text: '📸 С фото', callback_data: 'measure_photo' },
      { text: '◀️ Назад', callback_data: 'back_to_client' }
    ]
  ]
};

module.exports = {
  mainMenu,
  addClientButton,
  clientActionsMenu,
  workoutStatusMenu,
  settingsMenu,
  confirmMenu,
  backToMainMenu,
  skipButton,
  yesNoMenu,
  workoutTypeMenu,
  generateTimeSlotMenu,
  generateDateMenu,
  subscriptionTypeMenu,
  measurementTypeMenu
};