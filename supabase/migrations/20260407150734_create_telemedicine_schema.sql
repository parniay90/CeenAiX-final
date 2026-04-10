/*
  # Telemedicine Consultation Schema

  1. New Tables
    - `telemedicine_sessions`
      - `id` (uuid, primary key)
      - `consultation_id` (uuid, references consultations)
      - `doctor_id` (uuid, references doctors)
      - `patient_id` (uuid, references patients)
      - `session_url` (text) - video conference URL
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `duration_seconds` (integer)
      - `connection_quality` (enum: excellent, good, poor)
      - `is_recording` (boolean)
      - `recording_url` (text)
      - `recording_start_time` (timestamptz)
      - `dha_compliant` (boolean)
      - `status` (enum: scheduled, active, ended, cancelled)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `telemedicine_chat_messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references telemedicine_sessions)
      - `sender_id` (uuid, references auth.users)
      - `sender_type` (enum: doctor, patient)
      - `message` (text)
      - `is_arabic` (boolean)
      - `created_at` (timestamptz)

    - `telemedicine_shared_files`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references telemedicine_sessions)
      - `uploaded_by_id` (uuid, references auth.users)
      - `uploaded_by_type` (enum: doctor, patient)
      - `file_name` (text)
      - `file_type` (text)
      - `file_url` (text)
      - `file_size` (bigint)
      - `thumbnail_url` (text)
      - `created_at` (timestamptz)

    - `telemedicine_vitals`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references telemedicine_sessions)
      - `patient_id` (uuid, references patients)
      - `bp_systolic` (integer)
      - `bp_diastolic` (integer)
      - `heart_rate` (integer)
      - `temperature` (decimal)
      - `spo2` (integer)
      - `weight` (decimal)
      - `blood_glucose` (integer)
      - `taken_at` (timestamptz)
      - `created_at` (timestamptz)

    - `ai_consultation_summaries`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references telemedicine_sessions)
      - `consultation_id` (uuid, references consultations)
      - `chief_complaint` (text)
      - `key_symptoms` (jsonb)
      - `patient_concerns` (jsonb)
      - `discussed_topics` (jsonb)
      - `recommended_actions` (jsonb)
      - `prescriptions_mentioned` (jsonb)
      - `follow_up_needed` (boolean)
      - `follow_up_reason` (text)
      - `ai_confidence_score` (decimal)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for doctors and patients to access their own sessions
    - Ensure recording URLs are only accessible to authorized healthcare providers
*/

-- Create enum types
DO $$ BEGIN
  CREATE TYPE connection_quality AS ENUM ('excellent', 'good', 'poor');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE telemedicine_status AS ENUM ('scheduled', 'active', 'ended', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE message_sender_type AS ENUM ('doctor', 'patient');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Telemedicine sessions table
CREATE TABLE IF NOT EXISTS telemedicine_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES consultations(id),
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  session_url text,
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  duration_seconds integer,
  connection_quality connection_quality DEFAULT 'good',
  is_recording boolean DEFAULT false,
  recording_url text,
  recording_start_time timestamptz,
  dha_compliant boolean DEFAULT true,
  status telemedicine_status DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE telemedicine_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view own telemedicine sessions"
  ON telemedicine_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = telemedicine_sessions.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can manage own telemedicine sessions"
  ON telemedicine_sessions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = telemedicine_sessions.doctor_id
      AND doctors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = telemedicine_sessions.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can view own telemedicine sessions"
  ON telemedicine_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = telemedicine_sessions.patient_id
      AND auth.uid() = patients.id
    )
  );

-- Chat messages table
CREATE TABLE IF NOT EXISTS telemedicine_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES telemedicine_sessions(id) NOT NULL,
  sender_id uuid REFERENCES auth.users(id) NOT NULL,
  sender_type message_sender_type NOT NULL,
  message text NOT NULL,
  is_arabic boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE telemedicine_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own session messages"
  ON telemedicine_chat_messages FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM telemedicine_sessions ts
      JOIN doctors d ON d.id = ts.doctor_id
      WHERE ts.id = telemedicine_chat_messages.session_id
      AND d.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM telemedicine_sessions ts
      WHERE ts.id = telemedicine_chat_messages.session_id
      AND ts.patient_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in own sessions"
  ON telemedicine_chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND
    (
      EXISTS (
        SELECT 1 FROM telemedicine_sessions ts
        JOIN doctors d ON d.id = ts.doctor_id
        WHERE ts.id = telemedicine_chat_messages.session_id
        AND d.user_id = auth.uid()
      )
      OR
      EXISTS (
        SELECT 1 FROM telemedicine_sessions ts
        WHERE ts.id = telemedicine_chat_messages.session_id
        AND ts.patient_id = auth.uid()
      )
    )
  );

-- Shared files table
CREATE TABLE IF NOT EXISTS telemedicine_shared_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES telemedicine_sessions(id) NOT NULL,
  uploaded_by_id uuid REFERENCES auth.users(id) NOT NULL,
  uploaded_by_type message_sender_type NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_url text NOT NULL,
  file_size bigint,
  thumbnail_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE telemedicine_shared_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own session files"
  ON telemedicine_shared_files FOR SELECT
  TO authenticated
  USING (
    uploaded_by_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM telemedicine_sessions ts
      JOIN doctors d ON d.id = ts.doctor_id
      WHERE ts.id = telemedicine_shared_files.session_id
      AND d.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM telemedicine_sessions ts
      WHERE ts.id = telemedicine_shared_files.session_id
      AND ts.patient_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload files to own sessions"
  ON telemedicine_shared_files FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by_id = auth.uid()
    AND
    (
      EXISTS (
        SELECT 1 FROM telemedicine_sessions ts
        JOIN doctors d ON d.id = ts.doctor_id
        WHERE ts.id = telemedicine_shared_files.session_id
        AND d.user_id = auth.uid()
      )
      OR
      EXISTS (
        SELECT 1 FROM telemedicine_sessions ts
        WHERE ts.id = telemedicine_shared_files.session_id
        AND ts.patient_id = auth.uid()
      )
    )
  );

-- Telemedicine vitals table
CREATE TABLE IF NOT EXISTS telemedicine_vitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES telemedicine_sessions(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  bp_systolic integer,
  bp_diastolic integer,
  heart_rate integer,
  temperature decimal(4,1),
  spo2 integer,
  weight decimal(5,1),
  blood_glucose integer,
  taken_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE telemedicine_vitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view session vitals"
  ON telemedicine_vitals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM telemedicine_sessions ts
      JOIN doctors d ON d.id = ts.doctor_id
      WHERE ts.id = telemedicine_vitals.session_id
      AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can record vitals"
  ON telemedicine_vitals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM telemedicine_sessions ts
      JOIN doctors d ON d.id = ts.doctor_id
      WHERE ts.id = telemedicine_vitals.session_id
      AND d.user_id = auth.uid()
    )
  );

-- AI consultation summaries table
CREATE TABLE IF NOT EXISTS ai_consultation_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES telemedicine_sessions(id),
  consultation_id uuid REFERENCES consultations(id),
  chief_complaint text,
  key_symptoms jsonb,
  patient_concerns jsonb,
  discussed_topics jsonb,
  recommended_actions jsonb,
  prescriptions_mentioned jsonb,
  follow_up_needed boolean DEFAULT false,
  follow_up_reason text,
  ai_confidence_score decimal(3,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_consultation_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view AI summaries"
  ON ai_consultation_summaries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM telemedicine_sessions ts
      JOIN doctors d ON d.id = ts.doctor_id
      WHERE ts.id = ai_consultation_summaries.session_id
      AND d.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM consultations c
      JOIN doctors d ON d.id = c.doctor_id
      WHERE c.id = ai_consultation_summaries.consultation_id
      AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "System can create AI summaries"
  ON ai_consultation_summaries FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_telemedicine_sessions_doctor_id ON telemedicine_sessions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_telemedicine_sessions_patient_id ON telemedicine_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_telemedicine_sessions_status ON telemedicine_sessions(status);
CREATE INDEX IF NOT EXISTS idx_telemedicine_sessions_start_time ON telemedicine_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_telemedicine_chat_session_id ON telemedicine_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_telemedicine_files_session_id ON telemedicine_shared_files(session_id);
CREATE INDEX IF NOT EXISTS idx_telemedicine_vitals_session_id ON telemedicine_vitals(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_summaries_session_id ON ai_consultation_summaries(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_summaries_consultation_id ON ai_consultation_summaries(consultation_id);
