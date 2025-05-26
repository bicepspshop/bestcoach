class TrainerService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  /**
   * Создать нового тренера
   */
  async create(trainerData) {
    const { data, error } = await this.supabase
      .from('trainers')
      .insert([{
        telegram_id: trainerData.telegram_id,
        first_name: trainerData.first_name,
        last_name: trainerData.last_name,
        username: trainerData.username,
        phone: trainerData.phone,
        email: trainerData.email,
        specialization: trainerData.specialization,
        experience_years: trainerData.experience_years || 0,
        hourly_rate: trainerData.hourly_rate,
        currency: trainerData.currency || 'RUB'
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка создания тренера: ${error.message}`);
    }

    // Создаем базовые настройки для тренера
    await this.createDefaultSettings(data.id);

    return data;
  }

  /**
   * Получить тренера по Telegram ID
   */
  async getByTelegramId(telegramId) {
    const { data, error } = await this.supabase
      .from('trainers')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Ошибка получения тренера: ${error.message}`);
    }

    return data;
  }

  /**
   * Получить тренера по ID
   */
  async getById(id) {
    const { data, error } = await this.supabase
      .from('trainers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Ошибка получения тренера: ${error.message}`);
    }

    return data;
  }

  /**
   * Обновить данные тренера
   */
  async update(id, trainerData) {
    const { data, error } = await this.supabase
      .from('trainers')
      .update(trainerData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка обновления тренера: ${error.message}`);
    }

    return data;
  }

  /**
   * Получить настройки тренера
   */
  async getSettings(trainerId) {
    const { data, error } = await this.supabase
      .from('trainer_settings')
      .select('*')
      .eq('trainer_id', trainerId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Ошибка получения настроек: ${error.message}`);
    }

    return data;
  }

  /**
   * Обновить настройки тренера
   */
  async updateSettings(trainerId, settings) {
    const { data, error } = await this.supabase
      .from('trainer_settings')
      .upsert({
        trainer_id: trainerId,
        ...settings
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка обновления настроек: ${error.message}`);
    }

    return data;
  }

  /**
   * Создать настройки по умолчанию для нового тренера
   */
  async createDefaultSettings(trainerId) {
    const { data, error } = await this.supabase
      .from('trainer_settings')
      .insert([{
        trainer_id: trainerId,
        working_hours_start: '09:00',
        working_hours_end: '21:00',
        working_days: [1, 2, 3, 4, 5, 6], // Пн-Сб
        default_session_duration: 60,
        advance_booking_days: 30,
        cancellation_hours: 24,
        reminder_hours: 2,
        auto_confirm_bookings: false,
        email_notifications: true,
        telegram_notifications: true
      }])
      .select()
      .single();

    if (error) {
      console.error('Ошибка создания настроек по умолчанию:', error);
    }

    return data;
  }

  /**
   * Получить статистику тренера
   */
  async getStats(trainerId) {
    try {
      // Общее количество клиентов
      const { count: totalClients } = await this.supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId);

      // Активные клиенты
      const { count: activeClients } = await this.supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)
        .eq('is_active', true);

      // Тренировки за текущий месяц
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: monthlyWorkouts } = await this.supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)
        .gte('workout_date', startOfMonth.toISOString());

      // Доходы за текущий месяц
      const { data: monthlyPayments } = await this.supabase
        .from('payments')
        .select('amount')
        .eq('trainer_id', trainerId)
        .gte('payment_date', startOfMonth.toISOString().split('T')[0]);

      const monthlyRevenue = monthlyPayments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

      return {
        totalClients: totalClients || 0,
        activeClients: activeClients || 0,
        monthlyWorkouts: monthlyWorkouts || 0,
        monthlyRevenue: monthlyRevenue,
        averagePayment: monthlyPayments?.length ? monthlyRevenue / monthlyPayments.length : 0
      };

    } catch (error) {
      console.error('Ошибка получения статистики:', error);
      return {
        totalClients: 0,
        activeClients: 0,
        monthlyWorkouts: 0,
        monthlyRevenue: 0,
        averagePayment: 0
      };
    }
  }

  /**
   * Деактивировать тренера
   */
  async deactivate(id) {
    return await this.update(id, { is_active: false });
  }

  /**
   * Активировать тренера
   */
  async activate(id) {
    return await this.update(id, { is_active: true });
  }
}

module.exports = TrainerService;