import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://nludsxoqhhlfpehhblgg.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sdWRzeG9xaGhsZnBlaGhibGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODUyNjEsImV4cCI6MjA2Mzg2MTI2MX0.o6DtsgGgpuNQFIL9Gh2Ba-xScVW20dU_IDg4QAYYXxQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Сервисы для работы с данными
export class ApiService {
  
  // Тренеры
  static async getTrainerByTelegramId(telegramId) {
    const { data, error } = await supabase
      .from('trainers')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  }

  static async createTrainer(trainerData) {
    const { data, error } = await supabase
      .from('trainers')
      .insert([trainerData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateTrainer(id, data) {
    const { data: result, error } = await supabase
      .from('trainers')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Клиенты
  static async getClients(trainerId) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('trainer_id', trainerId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getClient(id) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createClient(clientData) {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateClient(id, data) {
    const { data: result, error } = await supabase
      .from('clients')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  // Тренировки
  static async getWorkouts(trainerId, options = {}) {
    let query = supabase
      .from('workouts')
      .select(`
        *,
        clients(first_name, last_name, phone)
      `)
      .eq('trainer_id', trainerId);

    if (options.dateFrom) {
      query = query.gte('workout_date', options.dateFrom);
    }

    if (options.dateTo) {
      query = query.lte('workout_date', options.dateTo);
    }

    if (options.status) {
      query = query.eq('status', options.status);
    }

    query = query.order('workout_date', { ascending: true });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createWorkout(workoutData) {
    const { data, error } = await supabase
      .from('workouts')
      .insert([workoutData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateWorkout(id, data) {
    const { data: result, error } = await supabase
      .from('workouts')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  static async deleteWorkout(id) {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Измерения
  static async getMeasurements(clientId) {
    const { data, error } = await supabase
      .from('measurements')
      .select('*')
      .eq('client_id', clientId)
      .order('measurement_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async createMeasurement(measurementData) {
    const { data, error } = await supabase
      .from('measurements')
      .insert([measurementData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Платежи
  static async getPayments(trainerId, options = {}) {
    let query = supabase
      .from('payments')
      .select(`
        *,
        clients(first_name, last_name)
      `)
      .eq('trainer_id', trainerId);

    if (options.clientId) {
      query = query.eq('client_id', options.clientId);
    }

    if (options.dateFrom) {
      query = query.gte('payment_date', options.dateFrom);
    }

    if (options.dateTo) {
      query = query.lte('payment_date', options.dateTo);
    }

    query = query.order('payment_date', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async createPayment(paymentData) {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Статистика
  static async getTrainerStats(trainerId) {
    try {
      // Клиенты
      const { count: totalClients } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId);

      const { count: activeClients } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)
        .eq('is_active', true);

      // Тренировки за текущий месяц
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: monthlyWorkouts } = await supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)
        .gte('workout_date', startOfMonth.toISOString());

      const { count: completedWorkouts } = await supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', trainerId)
        .eq('status', 'completed')
        .gte('workout_date', startOfMonth.toISOString());

      // Доходы за месяц
      const { data: monthlyPayments } = await supabase
        .from('payments')
        .select('amount')
        .eq('trainer_id', trainerId)
        .gte('payment_date', startOfMonth.toISOString().split('T')[0]);

      const monthlyRevenue = monthlyPayments?.reduce((sum, payment) => 
        sum + Number(payment.amount), 0) || 0;

      return {
        totalClients: totalClients || 0,
        activeClients: activeClients || 0,
        monthlyWorkouts: monthlyWorkouts || 0,
        completedWorkouts: completedWorkouts || 0,
        monthlyRevenue: monthlyRevenue,
        averagePayment: monthlyPayments?.length ? 
          monthlyRevenue / monthlyPayments.length : 0,
        completionRate: monthlyWorkouts > 0 ? 
          Math.round((completedWorkouts / monthlyWorkouts) * 100) : 0
      };

    } catch (error) {
      console.error('Ошибка получения статистики:', error);
      return {
        totalClients: 0,
        activeClients: 0,
        monthlyWorkouts: 0,
        completedWorkouts: 0,
        monthlyRevenue: 0,
        averagePayment: 0,
        completionRate: 0
      };
    }
  }

  // Настройки тренера
  static async getTrainerSettings(trainerId) {
    const { data, error } = await supabase
      .from('trainer_settings')
      .select('*')
      .eq('trainer_id', trainerId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  }

  static async updateTrainerSettings(trainerId, settings) {
    const { data, error } = await supabase
      .from('trainer_settings')
      .upsert({
        trainer_id: trainerId,
        ...settings
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}