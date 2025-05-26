class WorkoutService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  /**
   * Создать новую тренировку
   */
  async create(workoutData) {
    const { data, error } = await this.supabase
      .from('workouts')
      .insert([{
        trainer_id: workoutData.trainer_id,
        client_id: workoutData.client_id,
        title: workoutData.title,
        description: workoutData.description,
        workout_date: workoutData.workout_date,
        duration: workoutData.duration || 60,
        status: workoutData.status || 'scheduled',
        workout_type: workoutData.workout_type,
        location: workoutData.location,
        price: workoutData.price,
        notes: workoutData.notes
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка создания тренировки: ${error.message}`);
    }

    return data;
  }

  /**
   * Получить тренировку по ID
   */
  async getById(id) {
    const { data, error } = await this.supabase
      .from('workouts')
      .select(`
        *,
        clients(first_name, last_name, phone),
        trainers(first_name, last_name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Ошибка получения тренировки: ${error.message}`);
    }

    return data;
  }

  /**
   * Получить тренировки тренера
   */
  async getByTrainerId(trainerId, options = {}) {
    let query = this.supabase
      .from('workouts')
      .select(`
        *,
        clients(first_name, last_name, phone)
      `)
      .eq('trainer_id', trainerId);

    // Фильтры
    if (options.status) {
      query = query.eq('status', options.status);
    }

    if (options.dateFrom) {
      query = query.gte('workout_date', options.dateFrom);
    }

    if (options.dateTo) {
      query = query.lte('workout_date', options.dateTo);
    }

    if (options.clientId) {
      query = query.eq('client_id', options.clientId);
    }

    // Сортировка
    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending !== false });
    } else {
      query = query.order('workout_date', { ascending: true });
    }

    // Лимит
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Ошибка получения тренировок: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Получить тренировки клиента
   */
  async getByClientId(clientId, options = {}) {
    let query = this.supabase
      .from('workouts')
      .select(`
        *,
        trainers(first_name, last_name)
      `)
      .eq('client_id', clientId);

    if (options.status) {
      query = query.eq('status', options.status);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    query = query.order('workout_date', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error(`Ошибка получения тренировок клиента: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Обновить тренировку
   */
  async update(id, workoutData) {
    const { data, error } = await this.supabase
      .from('workouts')
      .update(workoutData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка обновления тренировки: ${error.message}`);
    }

    return data;
  }

  /**
   * Отметить тренировку как выполненную
   */
  async markAsCompleted(id, notes = null) {
    const workoutData = {
      status: 'completed'
    };

    if (notes) {
      workoutData.notes = notes;
    }

    const workout = await this.update(id, workoutData);

    // Списываем тренировку с абонемента клиента
    const ClientService = require('./clientService');
    const clientService = new ClientService(this.supabase);
    
    try {
      await clientService.useSession(workout.client_id);
    } catch (error) {
      console.warn('Не удалось списать тренировку с абонемента:', error.message);
    }

    return workout;
  }

  /**
   * Отменить тренировку
   */
  async cancel(id, reason = null) {
    const workoutData = {
      status: 'cancelled'
    };

    if (reason) {
      workoutData.notes = reason;
    }

    return await this.update(id, workoutData);
  }

  /**
   * Отметить как неявка
   */
  async markAsNoShow(id) {
    const workout = await this.update(id, { status: 'no_show' });

    // Всё равно списываем тренировку, так как время было забронировано
    const ClientService = require('./clientService');
    const clientService = new ClientService(this.supabase);
    
    try {
      await clientService.useSession(workout.client_id);
    } catch (error) {
      console.warn('Не удалось списать тренировку с абонемента:', error.message);
    }

    return workout;
  }

  /**
   * Добавить упражнения к тренировке
   */
  async addExercises(workoutId, exercises) {
    const exercisesData = exercises.map((exercise, index) => ({
      workout_id: workoutId,
      exercise_name: exercise.exercise_name,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      rest_time: exercise.rest_time,
      notes: exercise.notes,
      order_index: exercise.order_index || index
    }));

    const { data, error } = await this.supabase
      .from('workout_exercises')
      .insert(exercisesData)
      .select();

    if (error) {
      throw new Error(`Ошибка добавления упражнений: ${error.message}`);
    }

    return data;
  }

  /**
   * Получить упражнения тренировки
   */
  async getExercises(workoutId) {
    const { data, error } = await this.supabase
      .from('workout_exercises')
      .select('*')
      .eq('workout_id', workoutId)
      .order('order_index', { ascending: true });

    if (error) {
      throw new Error(`Ошибка получения упражнений: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Обновить упражнение
   */
  async updateExercise(exerciseId, exerciseData) {
    const { data, error } = await this.supabase
      .from('workout_exercises')
      .update(exerciseData)
      .eq('id', exerciseId)
      .select()
      .single();

    if (error) {
      throw new Error(`Ошибка обновления упражнения: ${error.message}`);
    }

    return data;
  }

  /**
   * Удалить упражнение
   */
  async deleteExercise(exerciseId) {
    const { error } = await this.supabase
      .from('workout_exercises')
      .delete()
      .eq('id', exerciseId);

    if (error) {
      throw new Error(`Ошибка удаления упражнения: ${error.message}`);
    }

    return true;
  }

  /**
   * Получить тренировки на сегодня
   */
  async getTodayWorkouts(trainerId) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return await this.getByTrainerId(trainerId, {
      dateFrom: today,
      dateTo: tomorrow,
      orderBy: 'workout_date'
    });
  }

  /**
   * Получить предстоящие тренировки
   */
  async getUpcomingWorkouts(trainerId, days = 7) {
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return await this.getByTrainerId(trainerId, {
      dateFrom: today,
      dateTo: futureDate,
      status: 'scheduled',
      orderBy: 'workout_date'
    });
  }

  /**
   * Получить статистику тренировок
   */
  async getWorkoutStats(trainerId, options = {}) {
    try {
      const startDate = options.startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const endDate = options.endDate || new Date().toISOString().split('T')[0];

      // Общее количество тренировок
      const { count: totalWorkouts } = await this.supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)
        .gte('workout_date', startDate)
        .lte('workout_date', endDate);

      // Проведенные тренировки
      const { count: completedWorkouts } = await this.supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)
        .eq('status', 'completed')
        .gte('workout_date', startDate)
        .lte('workout_date', endDate);

      // Отмененные тренировки
      const { count: cancelledWorkouts } = await this.supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)
        .eq('status', 'cancelled')
        .gte('workout_date', startDate)
        .lte('workout_date', endDate);

      // Неявки
      const { count: noShowWorkouts } = await this.supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)
        .eq('status', 'no_show')
        .gte('workout_date', startDate)
        .lte('workout_date', endDate);

      // Доходы
      const { data: workoutRevenue } = await this.supabase
        .from('workouts')
        .select('price')
        .eq('trainer_id', trainerId)
        .in('status', ['completed', 'no_show'])
        .gte('workout_date', startDate)
        .lte('workout_date', endDate);

      const totalRevenue = workoutRevenue?.reduce((sum, workout) => sum + Number(workout.price || 0), 0) || 0;

      return {
        totalWorkouts: totalWorkouts || 0,
        completedWorkouts: completedWorkouts || 0,
        cancelledWorkouts: cancelledWorkouts || 0,
        noShowWorkouts: noShowWorkouts || 0,
        completionRate: totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0,
        cancellationRate: totalWorkouts > 0 ? Math.round((cancelledWorkouts / totalWorkouts) * 100) : 0,
        noShowRate: totalWorkouts > 0 ? Math.round((noShowWorkouts / totalWorkouts) * 100) : 0,
        totalRevenue: totalRevenue,
        averagePrice: workoutRevenue?.length ? totalRevenue / workoutRevenue.length : 0
      };

    } catch (error) {
      console.error('Ошибка получения статистики тренировок:', error);
      return {
        totalWorkouts: 0,
        completedWorkouts: 0,
        cancelledWorkouts: 0,
        noShowWorkouts: 0,
        completionRate: 0,
        cancellationRate: 0,
        noShowRate: 0,
        totalRevenue: 0,
        averagePrice: 0
      };
    }
  }

  /**
   * Найти свободное время для тренировки
   */
  async findAvailableSlots(trainerId, date, duration = 60) {
    const startOfDay = `${date}T00:00:00.000Z`;
    const endOfDay = `${date}T23:59:59.999Z`;

    // Получаем все занятые слоты на день
    const { data: busySlots } = await this.supabase
      .from('workouts')
      .select('workout_date, duration')
      .eq('trainer_id', trainerId)
      .eq('status', 'scheduled')
      .gte('workout_date', startOfDay)
      .lte('workout_date', endOfDay)
      .order('workout_date', { ascending: true });

    // Получаем настройки рабочего времени тренера
    const { data: settings } = await this.supabase
      .from('trainer_settings')
      .select('working_hours_start, working_hours_end')
      .eq('trainer_id', trainerId)
      .single();

    const workStart = settings?.working_hours_start || '09:00';
    const workEnd = settings?.working_hours_end || '21:00';

    // Генерируем доступные слоты
    const availableSlots = [];
    const currentDate = new Date(`${date}T${workStart}:00.000Z`);
    const endTime = new Date(`${date}T${workEnd}:00.000Z`);

    while (currentDate < endTime) {
      const slotEnd = new Date(currentDate.getTime() + duration * 60000);
      
      if (slotEnd <= endTime) {
        // Проверяем, не пересекается ли с занятыми слотами
        const isAvailable = !busySlots?.some(slot => {
          const slotStart = new Date(slot.workout_date);
          const slotEndTime = new Date(slotStart.getTime() + (slot.duration || 60) * 60000);
          
          return (currentDate < slotEndTime && slotEnd > slotStart);
        });

        if (isAvailable) {
          availableSlots.push({
            start: currentDate.toISOString(),
            end: slotEnd.toISOString(),
            duration: duration
          });
        }
      }

      currentDate.setMinutes(currentDate.getMinutes() + 30); // Слоты по 30 минут
    }

    return availableSlots;
  }

  /**
   * Удалить тренировку
   */
  async delete(id) {
    // Сначала удаляем упражнения
    await this.supabase
      .from('workout_exercises')
      .delete()
      .eq('workout_id', id);

    // Затем удаляем саму тренировку
    const { error } = await this.supabase
      .from('workouts')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Ошибка удаления тренировки: ${error.message}`);
    }

    return true;
  }

  /**
   * Скопировать тренировку
   */
  async duplicate(workoutId, newDate) {
    const workout = await this.getById(workoutId);
    const exercises = await this.getExercises(workoutId);

    // Создаем копию тренировки
    const newWorkout = await this.create({
      trainer_id: workout.trainer_id,
      client_id: workout.client_id,
      title: `${workout.title} (копия)`,
      description: workout.description,
      workout_date: newDate,
      duration: workout.duration,
      workout_type: workout.workout_type,
      location: workout.location,
      price: workout.price
    });

    // Копируем упражнения
    if (exercises.length > 0) {
      await this.addExercises(newWorkout.id, exercises.map(ex => ({
        exercise_name: ex.exercise_name,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        rest_time: ex.rest_time,
        notes: ex.notes,
        order_index: ex.order_index
      })));
    }

    return newWorkout;
  }
}

module.exports = WorkoutService;