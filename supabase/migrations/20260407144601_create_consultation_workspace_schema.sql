/*
  # Clinical Consultation Workspace Schema

  1. New Tables
    - `consultations`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, references doctors)
      - `patient_id` (uuid, references patients)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `status` (enum: in_progress, completed, cancelled)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `soap_notes`
      - `id` (uuid, primary key)
      - `consultation_id` (uuid, references consultations)
      - `subjective` (text)
      - `objective` (text)
      - `assessment` (jsonb) - array of diagnoses with ICD-10 codes
      - `plan` (jsonb) - structured plan with prescriptions, orders, referrals
      - `is_final` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `prescriptions`
      - `id` (uuid, primary key)
      - `consultation_id` (uuid, references consultations)
      - `doctor_id` (uuid, references doctors)
      - `patient_id` (uuid, references patients)
      - `drug_name` (text)
      - `form` (text)
      - `strength` (text)
      - `dose` (text)
      - `frequency` (text)
      - `duration` (text)
      - `instructions_english` (text)
      - `instructions_arabic` (text)
      - `quantity` (integer)
      - `refills` (integer)
      - `pharmacy` (text)
      - `interaction_status` (enum: safe, monitor, contraindicated)
      - `is_sent` (boolean)
      - `dha_compliant` (boolean)
      - `created_at` (timestamptz)

    - `lab_orders`
      - `id` (uuid, primary key)
      - `consultation_id` (uuid, references consultations)
      - `doctor_id` (uuid, references doctors)
      - `patient_id` (uuid, references patients)
      - `test_name` (text)
      - `test_code` (text)
      - `priority` (enum: routine, urgent, stat)
      - `instructions` (text)
      - `status` (enum: ordered, collected, processing, completed)
      - `created_at` (timestamptz)

    - `referrals`
      - `id` (uuid, primary key)
      - `consultation_id` (uuid, references consultations)
      - `doctor_id` (uuid, references doctors)
      - `patient_id` (uuid, references patients)
      - `specialty` (text)
      - `referred_to_doctor` (text)
      - `reason` (text)
      - `urgency` (enum: routine, urgent, emergency)
      - `status` (enum: pending, accepted, completed, declined)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for doctors to access their own consultations and related data
*/

-- Create enum types
DO $$ BEGIN
  CREATE TYPE consultation_status AS ENUM ('in_progress', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE prescription_interaction AS ENUM ('safe', 'monitor', 'contraindicated');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE lab_priority AS ENUM ('routine', 'urgent', 'stat');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE lab_status AS ENUM ('ordered', 'collected', 'processing', 'completed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE referral_urgency AS ENUM ('routine', 'urgent', 'emergency');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE referral_status AS ENUM ('pending', 'accepted', 'completed', 'declined');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  status consultation_status DEFAULT 'in_progress',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view own consultations"
  ON consultations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = consultations.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can manage own consultations"
  ON consultations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = consultations.doctor_id
      AND doctors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = consultations.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

-- SOAP notes table
CREATE TABLE IF NOT EXISTS soap_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES consultations(id) NOT NULL,
  subjective text,
  objective text,
  assessment jsonb,
  plan jsonb,
  is_final boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE soap_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view own SOAP notes"
  ON soap_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM consultations c
      JOIN doctors d ON d.id = c.doctor_id
      WHERE c.id = soap_notes.consultation_id
      AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can manage own SOAP notes"
  ON soap_notes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM consultations c
      JOIN doctors d ON d.id = c.doctor_id
      WHERE c.id = soap_notes.consultation_id
      AND d.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM consultations c
      JOIN doctors d ON d.id = c.doctor_id
      WHERE c.id = soap_notes.consultation_id
      AND d.user_id = auth.uid()
    )
  );

-- Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES consultations(id),
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  drug_name text NOT NULL,
  form text NOT NULL,
  strength text NOT NULL,
  dose text NOT NULL,
  frequency text NOT NULL,
  duration text NOT NULL,
  instructions_english text,
  instructions_arabic text,
  quantity integer NOT NULL,
  refills integer DEFAULT 0,
  pharmacy text,
  interaction_status prescription_interaction DEFAULT 'safe',
  is_sent boolean DEFAULT false,
  dha_compliant boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view own prescriptions"
  ON prescriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = prescriptions.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can manage own prescriptions"
  ON prescriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = prescriptions.doctor_id
      AND doctors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = prescriptions.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

-- Lab orders table
CREATE TABLE IF NOT EXISTS lab_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES consultations(id),
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  test_name text NOT NULL,
  test_code text,
  priority lab_priority DEFAULT 'routine',
  instructions text,
  status lab_status DEFAULT 'ordered',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lab_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view own lab orders"
  ON lab_orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = lab_orders.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can manage own lab orders"
  ON lab_orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = lab_orders.doctor_id
      AND doctors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = lab_orders.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES consultations(id),
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  specialty text NOT NULL,
  referred_to_doctor text,
  reason text NOT NULL,
  urgency referral_urgency DEFAULT 'routine',
  status referral_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors can view own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = referrals.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can manage own referrals"
  ON referrals FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = referrals.doctor_id
      AND doctors.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = referrals.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_id ON consultations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_consultations_patient_id ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_soap_notes_consultation_id ON soap_notes(consultation_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_consultation_id ON prescriptions(consultation_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_orders_consultation_id ON lab_orders(consultation_id);
CREATE INDEX IF NOT EXISTS idx_referrals_consultation_id ON referrals(consultation_id);
