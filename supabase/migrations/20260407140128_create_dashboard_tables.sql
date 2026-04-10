/*
  # CeenAiX Dashboard Schema

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `doctor_name` (text) - Doctor's full name
      - `doctor_specialty` (text) - Medical specialty
      - `doctor_avatar` (text) - Avatar URL
      - `clinic_name` (text) - Clinic or hospital name
      - `appointment_date` (timestamptz) - Appointment date and time
      - `status` (text) - Confirmed/Pending/Teleconsult
      - `is_teleconsult` (boolean) - Whether it's a video consultation
      - `created_at` (timestamptz)

    - `medications`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `drug_name` (text) - Medication name
      - `dosage` (text) - Dosage information
      - `frequency` (text) - How often to take
      - `time_of_day` (text) - Time to take (e.g., "8AM", "2PM")
      - `active` (boolean) - Whether medication is currently active
      - `created_at` (timestamptz)

    - `medication_logs`
      - `id` (uuid, primary key)
      - `medication_id` (uuid, foreign key to medications)
      - `patient_id` (uuid, foreign key to patients)
      - `taken_at` (timestamptz) - When medication was taken
      - `scheduled_for` (date) - Which day it was scheduled for
      - `created_at` (timestamptz)

    - `health_metrics`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `metric_type` (text) - Type: blood_pressure, blood_sugar, weight, etc.
      - `value` (jsonb) - Metric value (can be complex like BP with systolic/diastolic)
      - `measured_at` (timestamptz) - When the measurement was taken
      - `created_at` (timestamptz)

    - `preventive_care`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `care_type` (text) - Type of preventive care
      - `status` (text) - completed/overdue/upcoming
      - `due_date` (date) - When it's due
      - `completed_date` (date) - When it was completed
      - `created_at` (timestamptz)

    - `documents`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `document_type` (text) - Type: lab_report/prescription/referral/etc.
      - `title` (text) - Document title
      - `file_url` (text) - URL to document file
      - `uploaded_at` (timestamptz) - Upload timestamp
      - `created_at` (timestamptz)

    - `ai_insights`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `insight_text` (text) - The AI-generated insight
      - `insight_type` (text) - Type: alert/recommendation/trend
      - `priority` (text) - high/medium/low
      - `related_metric` (text) - Which health metric this relates to
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to access their own data
*/

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_name text NOT NULL,
  doctor_specialty text NOT NULL,
  doctor_avatar text,
  clinic_name text NOT NULL,
  appointment_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  is_teleconsult boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  drug_name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  time_of_day text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS medication_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id uuid REFERENCES medications(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  taken_at timestamptz NOT NULL,
  scheduled_for date NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  metric_type text NOT NULL,
  value jsonb NOT NULL,
  measured_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS preventive_care (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  care_type text NOT NULL,
  status text NOT NULL DEFAULT 'upcoming',
  due_date date,
  completed_date date,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  title text NOT NULL,
  file_url text,
  uploaded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  insight_text text NOT NULL,
  insight_type text NOT NULL DEFAULT 'recommendation',
  priority text DEFAULT 'medium',
  related_metric text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE preventive_care ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can insert their own appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Users can update their own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (patient_id = auth.uid())
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Users can delete their own appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can view their own medications"
  ON medications FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can insert their own medications"
  ON medications FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Users can update their own medications"
  ON medications FOR UPDATE
  TO authenticated
  USING (patient_id = auth.uid())
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Users can delete their own medications"
  ON medications FOR DELETE
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can view their own medication logs"
  ON medication_logs FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can insert their own medication logs"
  ON medication_logs FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Users can view their own health metrics"
  ON health_metrics FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can insert their own health metrics"
  ON health_metrics FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Users can view their own preventive care"
  ON preventive_care FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can update their own preventive care"
  ON preventive_care FOR UPDATE
  TO authenticated
  USING (patient_id = auth.uid())
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Users can view their own documents"
  ON documents FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can insert their own documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Users can view their own AI insights"
  ON ai_insights FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());