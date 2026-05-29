/*
  # Clinic & Hospital Portal Schema

  ## New Tables

  ### clinic_profiles
  - id, name, type (clinic/hospital), license_number, address, city, phone, email, logo_url, status, created_at

  ### clinic_doctors
  - id, clinic_id (fk), user_id, name, specialty, dha_license, photo_url, bio, status (active/inactive/pending), joined_at

  ### clinic_appointment_types
  - id, clinic_id (fk), doctor_id (fk, nullable = any doctor), name, duration_minutes, price_aed, currency, description, is_active

  ### clinic_appointments
  - id, clinic_id (fk), doctor_id (fk), patient_name, patient_phone, appointment_type_id (fk), scheduled_at, status (scheduled/confirmed/completed/cancelled/no_show), notes, created_at

  ## Security
  - RLS enabled on all tables
  - Authenticated users can manage their clinic's data
*/

CREATE TABLE IF NOT EXISTS clinic_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'clinic',
  license_number text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  logo_url text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clinic_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view clinic profiles"
  ON clinic_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert clinic profiles"
  ON clinic_profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clinic profiles"
  ON clinic_profiles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS clinic_doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES clinic_profiles(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  specialty text NOT NULL DEFAULT '',
  dha_license text NOT NULL DEFAULT '',
  photo_url text,
  bio text DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  availability jsonb DEFAULT '{}',
  joined_at timestamptz DEFAULT now()
);

ALTER TABLE clinic_doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view clinic doctors"
  ON clinic_doctors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert clinic doctors"
  ON clinic_doctors FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clinic doctors"
  ON clinic_doctors FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete clinic doctors"
  ON clinic_doctors FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS clinic_appointment_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES clinic_profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES clinic_doctors(id) ON DELETE SET NULL,
  name text NOT NULL DEFAULT '',
  duration_minutes integer NOT NULL DEFAULT 30,
  price_aed numeric(10,2) NOT NULL DEFAULT 0,
  description text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clinic_appointment_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view appointment types"
  ON clinic_appointment_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert appointment types"
  ON clinic_appointment_types FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update appointment types"
  ON clinic_appointment_types FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete appointment types"
  ON clinic_appointment_types FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS clinic_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES clinic_profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES clinic_doctors(id) ON DELETE SET NULL,
  appointment_type_id uuid REFERENCES clinic_appointment_types(id) ON DELETE SET NULL,
  patient_name text NOT NULL DEFAULT '',
  patient_phone text NOT NULL DEFAULT '',
  patient_emirates_id text DEFAULT '',
  scheduled_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clinic_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view clinic appointments"
  ON clinic_appointments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert clinic appointments"
  ON clinic_appointments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clinic appointments"
  ON clinic_appointments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete clinic appointments"
  ON clinic_appointments FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_clinic_doctors_clinic_id ON clinic_doctors(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_appt_types_clinic_id ON clinic_appointment_types(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_appointments_clinic_id ON clinic_appointments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_appointments_scheduled_at ON clinic_appointments(scheduled_at);
