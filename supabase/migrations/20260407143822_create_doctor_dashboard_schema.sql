/*
  # Doctor Dashboard Schema

  1. New Tables
    - `doctors`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `specialty` (text)
      - `dha_license` (text, unique)
      - `clinic_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `doctor_appointments`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, references doctors)
      - `patient_id` (uuid, references patients)
      - `appointment_time` (timestamptz)
      - `duration_minutes` (integer)
      - `reason` (text)
      - `type` (enum: new, follow-up, urgent, teleconsult)
      - `status` (enum: confirmed, pending, completed, no-show, cancelled)
      - `notes` (text)
      - `ai_pre_consultation_note` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `critical_alerts`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, references doctors)
      - `patient_id` (uuid, references patients)
      - `alert_type` (text)
      - `severity` (enum: critical, warning, info)
      - `message` (text)
      - `is_resolved` (boolean)
      - `created_at` (timestamptz)
      - `resolved_at` (timestamptz)

    - `clinical_insights`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, references doctors)
      - `insight_type` (enum: screening, interaction, referral, general)
      - `message` (text)
      - `details` (jsonb)
      - `priority` (integer)
      - `is_acknowledged` (boolean)
      - `created_at` (timestamptz)

    - `patient_activities`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, references doctors)
      - `patient_id` (uuid, references patients)
      - `activity_type` (enum: lab, message, appointment, prescription)
      - `message` (text)
      - `metadata` (jsonb)
      - `is_read` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for doctors to access only their own data
*/

-- Create enum types
DO $$ BEGIN
  CREATE TYPE appointment_type AS ENUM ('new', 'follow-up', 'urgent', 'teleconsult');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM ('confirmed', 'pending', 'completed', 'no-show', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE alert_severity AS ENUM ('critical', 'warning', 'info');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE insight_type AS ENUM ('screening', 'interaction', 'referral', 'general');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE activity_type AS ENUM ('lab', 'message', 'appointment', 'prescription');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  specialty text NOT NULL,
  dha_license text UNIQUE NOT NULL,
  clinic_name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can read own profile"
  ON doctors FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Doctors can update own profile"
  ON doctors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Doctor appointments table
CREATE TABLE IF NOT EXISTS doctor_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  appointment_time timestamptz NOT NULL,
  duration_minutes integer DEFAULT 30,
  reason text NOT NULL,
  type appointment_type NOT NULL,
  status appointment_status DEFAULT 'pending',
  notes text,
  ai_pre_consultation_note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE doctor_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view own appointments"
  ON doctor_appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = doctor_appointments.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can manage own appointments"
  ON doctor_appointments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = doctor_appointments.doctor_id
      AND doctors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = doctor_appointments.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

-- Critical alerts table
CREATE TABLE IF NOT EXISTS critical_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  alert_type text NOT NULL,
  severity alert_severity NOT NULL,
  message text NOT NULL,
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE critical_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view own alerts"
  ON critical_alerts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = critical_alerts.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can manage own alerts"
  ON critical_alerts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = critical_alerts.doctor_id
      AND doctors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = critical_alerts.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

-- Clinical insights table
CREATE TABLE IF NOT EXISTS clinical_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  insight_type insight_type NOT NULL,
  message text NOT NULL,
  details jsonb,
  priority integer DEFAULT 0,
  is_acknowledged boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clinical_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view own insights"
  ON clinical_insights FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = clinical_insights.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can acknowledge own insights"
  ON clinical_insights FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = clinical_insights.doctor_id
      AND doctors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = clinical_insights.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

-- Patient activities table
CREATE TABLE IF NOT EXISTS patient_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  activity_type activity_type NOT NULL,
  message text NOT NULL,
  metadata jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE patient_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view own patient activities"
  ON patient_activities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = patient_activities.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can mark activities as read"
  ON patient_activities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = patient_activities.doctor_id
      AND doctors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = patient_activities.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_doctor_appointments_doctor_id ON doctor_appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_appointments_patient_id ON doctor_appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_doctor_appointments_time ON doctor_appointments(appointment_time);
CREATE INDEX IF NOT EXISTS idx_critical_alerts_doctor_id ON critical_alerts(doctor_id);
CREATE INDEX IF NOT EXISTS idx_clinical_insights_doctor_id ON clinical_insights(doctor_id);
CREATE INDEX IF NOT EXISTS idx_patient_activities_doctor_id ON patient_activities(doctor_id);
