-- BestCoach Database Schema
-- Схема базы данных для фитнес-помощника

-- Тренеры
CREATE TABLE IF NOT EXISTS trainers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  username VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  specialization TEXT,
  experience_years INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'RUB',
  timezone VARCHAR(50) DEFAULT 'Europe/Moscow',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Клиенты
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE,
  telegram_id BIGINT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  username VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  birth_date DATE,
  gender VARCHAR(10),
  height INTEGER,
  initial_weight DECIMAL(5,2),
  current_weight DECIMAL(5,2),
  target_weight DECIMAL(5,2),
  goal TEXT,
  medical_notes TEXT,
  emergency_contact VARCHAR(255),
  subscription_type VARCHAR(50),
  subscription_start DATE,
  subscription_end DATE,
  sessions_total INTEGER DEFAULT 0,
  sessions_used INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Тренировки
CREATE TABLE IF NOT EXISTS workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  workout_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER DEFAULT 60,
  status VARCHAR(20) DEFAULT 'scheduled',
  workout_type VARCHAR(50),
  location VARCHAR(255),
  price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Упражнения в тренировке
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_name VARCHAR(255) NOT NULL,
  sets INTEGER,
  reps VARCHAR(50),
  weight DECIMAL(5,2),
  rest_time INTEGER,
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Измерения и прогресс
CREATE TABLE IF NOT EXISTS measurements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  measurement_date DATE NOT NULL,
  weight DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  muscle_mass DECIMAL(5,2),
  chest DECIMAL(5,2),
  waist DECIMAL(5,2),
  hips DECIMAL(5,2),
  bicep DECIMAL(5,2),
  thigh DECIMAL(5,2),
  neck DECIMAL(5,2),
  notes TEXT,
  photo_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Финансы и платежи
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'RUB',
  payment_date DATE NOT NULL,
  payment_type VARCHAR(50),
  description TEXT,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Программы тренировок
CREATE TABLE IF NOT EXISTS workout_programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  goal VARCHAR(100),
  difficulty_level VARCHAR(20),
  duration_weeks INTEGER,
  sessions_per_week INTEGER,
  is_template BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Упражнения программы
CREATE TABLE IF NOT EXISTS program_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES workout_programs(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  exercise_name VARCHAR(255) NOT NULL,
  sets INTEGER,
  reps VARCHAR(50),
  weight_percentage DECIMAL(4,2),
  rest_time INTEGER,
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Назначенные программы клиентам
CREATE TABLE IF NOT EXISTS client_programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  program_id UUID REFERENCES workout_programs(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  progress_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Чат сообщения
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  sender_type VARCHAR(10) NOT NULL,
  message_text TEXT,
  message_type VARCHAR(20) DEFAULT 'text',
  file_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Уведомления
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  user_type VARCHAR(10) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50),
  is_read BOOLEAN DEFAULT false,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Настройки тренера
CREATE TABLE IF NOT EXISTS trainer_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE UNIQUE,
  working_hours_start TIME DEFAULT '09:00',
  working_hours_end TIME DEFAULT '21:00',
  working_days INTEGER[] DEFAULT '{1,2,3,4,5,6}',
  default_session_duration INTEGER DEFAULT 60,
  advance_booking_days INTEGER DEFAULT 30,
  cancellation_hours INTEGER DEFAULT 24,
  reminder_hours INTEGER DEFAULT 2,
  auto_confirm_bookings BOOLEAN DEFAULT false,
  email_notifications BOOLEAN DEFAULT true,
  telegram_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_trainers_telegram_id ON trainers(telegram_id);
CREATE INDEX IF NOT EXISTS idx_clients_trainer_id ON clients(trainer_id);
CREATE INDEX IF NOT EXISTS idx_clients_telegram_id ON clients(telegram_id);
CREATE INDEX IF NOT EXISTS idx_workouts_trainer_id ON workouts(trainer_id);
CREATE INDEX IF NOT EXISTS idx_workouts_client_id ON workouts(client_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(workout_date);
CREATE INDEX IF NOT EXISTS idx_measurements_client_id ON measurements(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_trainer_id ON payments(trainer_id);
CREATE INDEX IF NOT EXISTS idx_messages_trainer_client ON messages(trainer_id, client_id);

-- Функции и триггеры
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры
CREATE TRIGGER update_trainers_updated_at 
  BEFORE UPDATE ON trainers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at 
  BEFORE UPDATE ON clients 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at 
  BEFORE UPDATE ON workouts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_programs_updated_at 
  BEFORE UPDATE ON workout_programs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainer_settings_updated_at 
  BEFORE UPDATE ON trainer_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();