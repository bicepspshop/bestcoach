class ClientService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  /**
   * Создать нового клиента
   */
  async create(clientData) {
    const { data, error } = await this.supabase
      .from('clients')
      .insert([{
        trainer_id: clientData.trainer_id,
        telegram_id: clientData.telegram_id,
        first_name: clientData.first_name,
        last_name: clientData.last_name,
        username: clientData.username,
        phone: clientData.phone,
        email: clientData.email,
        birth_date: clientData.birth_date,
        gender: clientData.gender,
        height: clientData.height,
        initial_weight: clientData.initial_weight,
        current_weight: clientData.current_weight || clientData.initial_weight,
        target_weight: clientData.target_weight,
        goal: clientData.goal,
        medical_notes: clientData.medical_notes,
        emergency_contact: clientData.emergency_contact,
        subscription_type: clientData.subscription_type,
        subscription_start: clientData.subscription_start,
        subscription_end: clientData.subscription_end,
        sessions_total: clientData.sessions_total || 0,
        sessions_used: clientData.sessions_used || 0
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка создания клиента: ${error.message}`);
    }

    return data;
  }

  /**
   * Получить всех клиентов тренера
   */
  async getByTrainerId(trainerId, options = {}) {
    let query = this.supabase
      .from('clients')
      .select('*')
      .eq('trainer_id', trainerId);

    if (options.activeOnly) {
      query = query.eq('is_active', true);
    }

    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending !== false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Ошибка получения клиентов: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Получить клиента по ID
   */
  async getById(id) {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Ошибка получения клиента: ${error.message}`);
    }

    return data;
  }

  /**
   * Получить клиента по Telegram ID
   */
  async getByTelegramId(telegramId) {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Ошибка получения клиента: ${error.message}`);
    }

    return data;
  }

  /**
   * Обновить данные клиента
   */
  async update(id, clientData) {
    const { data, error } = await this.supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка обновления клиента: ${error.message}`);
    }

    return data;
  }

  /**
   * Добавить измерения клиента
   */
  async addMeasurement(clientId, measurementData) {
    const { data, error } = await this.supabase
      .from('measurements')
      .insert([{
        client_id: clientId,
        measurement_date: measurementData.measurement_date || new Date().toISOString().split('T')[0],
        weight: measurementData.weight,
        body_fat_percentage: measurementData.body_fat_percentage,
        muscle_mass: measurementData.muscle_mass,
        chest: measurementData.chest,
        waist: measurementData.waist,
        hips: measurementData.hips,
        bicep: measurementData.bicep,
        thigh: measurementData.thigh,
        neck: measurementData.neck,
        notes: measurementData.notes,
        photo_urls: measurementData.photo_urls
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка добавления измерения: ${error.message}`);
    }

    // Обновляем текущий вес клиента
    if (measurementData.weight) {
      await this.update(clientId, { current_weight: measurementData.weight });
    }

    return data;
  }

  /**
   * Получить измерения клиента
   */
  async getMeasurements(clientId, limit = 10) {
    const { data, error } = await this.supabase
      .from('measurements')
      .select('*')
      .eq('client_id', clientId)
      .order('measurement_date', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Ошибка получения измерений: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Получить статистику клиента
   */
  async getClientStats(clientId) {
    try {
      // Общее количество тренировок
      const { count: totalWorkouts } = await this.supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', clientId);

      // Проведенные тренировки
      const { count: completedWorkouts } = await this.supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', clientId)
        .eq('status', 'completed');

      // Последние измерения
      const { data: latestMeasurement } = await this.supabase
        .from('measurements')
        .select('*')
        .eq('client_id', clientId)
        .order('measurement_date', { ascending: false })
        .limit(1)
        .single();

      // Первые измерения
      const { data: firstMeasurement } = await this.supabase
        .from('measurements')
        .select('*')
        .eq('client_id', clientId)
        .order('measurement_date', { ascending: true })
        .limit(1)
        .single();

      // Вычисляем прогресс
      let weightProgress = 0;
      if (latestMeasurement && firstMeasurement) {
        weightProgress = Number(latestMeasurement.weight) - Number(firstMeasurement.weight);
      }

      return {
        totalWorkouts: totalWorkouts || 0,
        completedWorkouts: completedWorkouts || 0,
        attendanceRate: totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0,
        weightProgress: weightProgress,
        latestWeight: latestMeasurement?.weight,
        measurementsCount: await this.getMeasurementsCount(clientId)
      };

    } catch (error) {
      console.error('Ошибка получения статистики клиента:', error);
      return {
        totalWorkouts: 0,
        completedWorkouts: 0,
        attendanceRate: 0,
        weightProgress: 0,
        latestWeight: null,
        measurementsCount: 0
      };
    }
  }

  /**
   * Получить количество измерений
   */
  async getMeasurementsCount(clientId) {
    const { count } = await this.supabase
      .from('measurements')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId);

    return count || 0;
  }

  /**
   * Использовать тренировку из абонемента
   */
  async useSession(clientId) {
    const client = await this.getById(clientId);
    
    if (client.sessions_used >= client.sessions_total) {
      throw new Error('У клиента закончились тренировки в абонементе');
    }

    return await this.update(clientId, {
      sessions_used: client.sessions_used + 1
    });
  }

  /**
   * Добавить тренировки в абонемент
   */
  async addSessions(clientId, sessionsToAdd) {
    const client = await this.getById(clientId);
    
    return await this.update(clientId, {
      sessions_total: client.sessions_total + sessionsToAdd
    });
  }

  /**
   * Продлить абонемент
   */
  async extendSubscription(clientId, newEndDate) {
    return await this.update(clientId, {
      subscription_end: newEndDate
    });
  }

  /**
   * Поиск клиентов по имени
   */
  async search(trainerId, searchTerm) {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('trainer_id', trainerId)
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
      .order('first_name', { ascending: true });

    if (error) {
      throw new Error(`Ошибка поиска клиентов: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Деактивировать клиента
   */
  async deactivate(id) {
    return await this.update(id, { is_active: false });
  }

  /**
   * Активировать клиента
   */
  async activate(id) {
    return await this.update(id, { is_active: true });
  }

  /**
   * Удалить клиента (мягкое удаление)
   */
  async delete(id) {
    return await this.deactivate(id);
  }

  /**
   * Получить клиентов с истекающими абонементами
   */
  async getClientsWithExpiringSubscriptions(trainerId, daysAhead = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('trainer_id', trainerId)
      .eq('is_active', true)
      .not('subscription_end', 'is', null)
      .lte('subscription_end', futureDate.toISOString().split('T')[0])
      .order('subscription_end', { ascending: true });

    if (error) {
      throw new Error(`Ошибка получения клиентов с истекающими абонементами: ${error.message}`);
    }

    return data || [];
  }
}

module.exports = ClientService;