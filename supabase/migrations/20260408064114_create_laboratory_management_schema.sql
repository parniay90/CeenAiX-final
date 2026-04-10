/*
  # Laboratory Management System Schema

  1. New Tables
    - `laboratories`
      - `id` (uuid, primary key)
      - `name` (text) - Laboratory name
      - `dha_license_number` (text) - DHA license
      - `address` (text)
      - `contact_phone` (text)
      - `contact_email` (text)
      - `director_name` (text) - Lab director
      - `accreditation` (text) - CAP, JCI, etc.
      - `active` (boolean)
      - `created_at` (timestamptz)

    - `lab_tests`
      - `id` (uuid, primary key)
      - `code` (text, unique) - Test code (e.g., CBC, FBS)
      - `name` (text) - Full test name
      - `category` (enum) - chemistry, hematology, microbiology, hormones, serology
      - `specimen_type` (text) - Blood, urine, etc.
      - `normal_range_min` (decimal)
      - `normal_range_max` (decimal)
      - `unit` (text) - mg/L, mmol/L, etc.
      - `tat_minutes` (integer) - Target turnaround time
      - `critical_low` (decimal) - Critical low threshold
      - `critical_high` (decimal) - Critical high threshold
      - `price` (decimal)
      - `active` (boolean)
      - `created_at` (timestamptz)

    - `samples`
      - `id` (uuid, primary key)
      - `sample_id` (text, unique) - LAB-2026-001234
      - `laboratory_id` (uuid, references laboratories)
      - `patient_id` (uuid, references patients)
      - `ordering_doctor_id` (uuid, references doctors)
      - `clinic_id` (uuid)
      - `barcode` (text, unique)
      - `specimen_type` (text)
      - `collection_time` (timestamptz)
      - `received_time` (timestamptz)
      - `priority` (enum) - stat, urgent, routine
      - `status` (enum) - received, accessioned, in_progress, resulted, verified, released, nabidh_submitted
      - `assigned_technician_id` (uuid, references lab_technicians)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `sample_tests`
      - `id` (uuid, primary key)
      - `sample_id` (uuid, references samples)
      - `test_id` (uuid, references lab_tests)
      - `status` (enum) - Same as sample status
      - `result_value` (text) - Actual result
      - `result_unit` (text)
      - `is_critical` (boolean)
      - `reference_range` (text)
      - `resulted_at` (timestamptz)
      - `resulted_by` (uuid, references lab_technicians)
      - `verified_at` (timestamptz)
      - `verified_by` (uuid, references lab_technicians)
      - `qc_run_id` (uuid, references qc_runs)
      - `created_at` (timestamptz)

    - `critical_value_notifications`
      - `id` (uuid, primary key)
      - `sample_test_id` (uuid, references sample_tests)
      - `patient_id` (uuid, references patients)
      - `ordering_doctor_id` (uuid, references doctors)
      - `critical_value` (text)
      - `test_name` (text)
      - `notified` (boolean)
      - `notified_at` (timestamptz)
      - `notified_by` (uuid, references lab_technicians)
      - `notification_method` (text) - Phone, SMS, system
      - `notes` (text)
      - `created_at` (timestamptz)

    - `lab_technicians`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `laboratory_id` (uuid, references laboratories)
      - `full_name` (text)
      - `employee_id` (text, unique)
      - `license_number` (text) - DHA license
      - `specialization` (text)
      - `active` (boolean)
      - `created_at` (timestamptz)

    - `lab_equipment`
      - `id` (uuid, primary key)
      - `laboratory_id` (uuid, references laboratories)
      - `name` (text)
      - `model` (text)
      - `serial_number` (text, unique)
      - `manufacturer` (text)
      - `category` (enum) - chemistry, hematology, microbiology, hormones, serology
      - `status` (enum) - online, running, maintenance, offline
      - `last_maintenance_date` (date)
      - `next_maintenance_date` (date)
      - `calibration_due_date` (date)
      - `active` (boolean)
      - `created_at` (timestamptz)

    - `qc_runs`
      - `id` (uuid, primary key)
      - `equipment_id` (uuid, references lab_equipment)
      - `test_id` (uuid, references lab_tests)
      - `run_date` (timestamptz)
      - `result` (enum) - pass, fail, pending
      - `control_lot` (text)
      - `control_level` (text) - Level 1, 2, 3
      - `expected_value` (decimal)
      - `actual_value` (decimal)
      - `deviation` (decimal)
      - `performed_by` (uuid, references lab_technicians)
      - `notes` (text)
      - `created_at` (timestamptz)

    - `nabidh_submissions`
      - `id` (uuid, primary key)
      - `sample_id` (uuid, references samples)
      - `submission_date` (timestamptz)
      - `status` (enum) - pending, submitted, acknowledged, failed
      - `nabidh_id` (text) - NABIDH reference ID
      - `submission_payload` (jsonb)
      - `response_payload` (jsonb)
      - `error_message` (text)
      - `submitted_by` (uuid, references lab_technicians)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Lab technicians can access records for their laboratory only
    - Critical value notifications are audit-logged
    - QC runs are immutable for compliance
    - NABIDH submissions are tracked for audit
*/

-- Create enum types
DO $$ BEGIN
  CREATE TYPE lab_test_category AS ENUM ('chemistry', 'hematology', 'microbiology', 'hormones', 'serology');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE sample_priority AS ENUM ('stat', 'urgent', 'routine');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE sample_status AS ENUM ('received', 'accessioned', 'in_progress', 'resulted', 'verified', 'released', 'nabidh_submitted');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE equipment_status AS ENUM ('online', 'running', 'maintenance', 'offline');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE qc_result AS ENUM ('pass', 'fail', 'pending');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE nabidh_status AS ENUM ('pending', 'submitted', 'acknowledged', 'failed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Laboratories table
CREATE TABLE IF NOT EXISTS laboratories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  dha_license_number text UNIQUE NOT NULL,
  address text,
  contact_phone text,
  contact_email text,
  director_name text,
  accreditation text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE laboratories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active laboratories"
  ON laboratories FOR SELECT
  TO authenticated
  USING (active = true);

-- Lab tests table
CREATE TABLE IF NOT EXISTS lab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  category lab_test_category NOT NULL,
  specimen_type text NOT NULL,
  normal_range_min decimal(10,2),
  normal_range_max decimal(10,2),
  unit text,
  tat_minutes integer DEFAULT 240,
  critical_low decimal(10,2),
  critical_high decimal(10,2),
  price decimal(10,2),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lab_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active lab tests"
  ON lab_tests FOR SELECT
  TO authenticated
  USING (active = true);

-- Lab technicians table
CREATE TABLE IF NOT EXISTS lab_technicians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  laboratory_id uuid REFERENCES laboratories(id) NOT NULL,
  full_name text NOT NULL,
  employee_id text UNIQUE NOT NULL,
  license_number text,
  specialization text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lab_technicians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technicians can view their own record"
  ON lab_technicians FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Samples table
CREATE TABLE IF NOT EXISTS samples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_id text UNIQUE NOT NULL,
  laboratory_id uuid REFERENCES laboratories(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  ordering_doctor_id uuid REFERENCES doctors(id) NOT NULL,
  clinic_id uuid,
  barcode text UNIQUE NOT NULL,
  specimen_type text NOT NULL,
  collection_time timestamptz NOT NULL,
  received_time timestamptz NOT NULL,
  priority sample_priority DEFAULT 'routine',
  status sample_status DEFAULT 'received',
  assigned_technician_id uuid REFERENCES lab_technicians(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE samples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technicians can view laboratory samples"
  ON samples FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lab_technicians
      WHERE lab_technicians.laboratory_id = samples.laboratory_id
      AND lab_technicians.user_id = auth.uid()
    )
  );

CREATE POLICY "Technicians can manage laboratory samples"
  ON samples FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lab_technicians
      WHERE lab_technicians.laboratory_id = samples.laboratory_id
      AND lab_technicians.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lab_technicians
      WHERE lab_technicians.laboratory_id = samples.laboratory_id
      AND lab_technicians.user_id = auth.uid()
    )
  );

-- Sample tests table
CREATE TABLE IF NOT EXISTS sample_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_id uuid REFERENCES samples(id) NOT NULL,
  test_id uuid REFERENCES lab_tests(id) NOT NULL,
  status sample_status DEFAULT 'received',
  result_value text,
  result_unit text,
  is_critical boolean DEFAULT false,
  reference_range text,
  resulted_at timestamptz,
  resulted_by uuid REFERENCES lab_technicians(id),
  verified_at timestamptz,
  verified_by uuid REFERENCES lab_technicians(id),
  qc_run_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sample_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technicians can view sample tests"
  ON sample_tests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM samples s
      JOIN lab_technicians lt ON lt.laboratory_id = s.laboratory_id
      WHERE s.id = sample_tests.sample_id
      AND lt.user_id = auth.uid()
    )
  );

CREATE POLICY "Technicians can manage sample tests"
  ON sample_tests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM samples s
      JOIN lab_technicians lt ON lt.laboratory_id = s.laboratory_id
      WHERE s.id = sample_tests.sample_id
      AND lt.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM samples s
      JOIN lab_technicians lt ON lt.laboratory_id = s.laboratory_id
      WHERE s.id = sample_tests.sample_id
      AND lt.user_id = auth.uid()
    )
  );

-- Critical value notifications table
CREATE TABLE IF NOT EXISTS critical_value_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_test_id uuid REFERENCES sample_tests(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  ordering_doctor_id uuid REFERENCES doctors(id) NOT NULL,
  critical_value text NOT NULL,
  test_name text NOT NULL,
  notified boolean DEFAULT false,
  notified_at timestamptz,
  notified_by uuid REFERENCES lab_technicians(id),
  notification_method text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE critical_value_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technicians can view critical notifications"
  ON critical_value_notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sample_tests st
      JOIN samples s ON s.id = st.sample_id
      JOIN lab_technicians lt ON lt.laboratory_id = s.laboratory_id
      WHERE st.id = critical_value_notifications.sample_test_id
      AND lt.user_id = auth.uid()
    )
  );

CREATE POLICY "Technicians can update critical notifications"
  ON critical_value_notifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sample_tests st
      JOIN samples s ON s.id = st.sample_id
      JOIN lab_technicians lt ON lt.laboratory_id = s.laboratory_id
      WHERE st.id = critical_value_notifications.sample_test_id
      AND lt.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sample_tests st
      JOIN samples s ON s.id = st.sample_id
      JOIN lab_technicians lt ON lt.laboratory_id = s.laboratory_id
      WHERE st.id = critical_value_notifications.sample_test_id
      AND lt.user_id = auth.uid()
    )
  );

-- Lab equipment table
CREATE TABLE IF NOT EXISTS lab_equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  laboratory_id uuid REFERENCES laboratories(id) NOT NULL,
  name text NOT NULL,
  model text NOT NULL,
  serial_number text UNIQUE NOT NULL,
  manufacturer text,
  category lab_test_category NOT NULL,
  status equipment_status DEFAULT 'online',
  last_maintenance_date date,
  next_maintenance_date date,
  calibration_due_date date,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lab_equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technicians can view laboratory equipment"
  ON lab_equipment FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lab_technicians
      WHERE lab_technicians.laboratory_id = lab_equipment.laboratory_id
      AND lab_technicians.user_id = auth.uid()
    )
  );

-- QC runs table
CREATE TABLE IF NOT EXISTS qc_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id uuid REFERENCES lab_equipment(id) NOT NULL,
  test_id uuid REFERENCES lab_tests(id),
  run_date timestamptz DEFAULT now(),
  result qc_result DEFAULT 'pending',
  control_lot text,
  control_level text,
  expected_value decimal(10,2),
  actual_value decimal(10,2),
  deviation decimal(10,2),
  performed_by uuid REFERENCES lab_technicians(id) NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE qc_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technicians can view QC runs"
  ON qc_runs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lab_equipment le
      JOIN lab_technicians lt ON lt.laboratory_id = le.laboratory_id
      WHERE le.id = qc_runs.equipment_id
      AND lt.user_id = auth.uid()
    )
  );

CREATE POLICY "Technicians can create QC runs"
  ON qc_runs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lab_technicians
      WHERE lab_technicians.id = qc_runs.performed_by
      AND lab_technicians.user_id = auth.uid()
    )
  );

-- NABIDH submissions table
CREATE TABLE IF NOT EXISTS nabidh_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_id uuid REFERENCES samples(id) NOT NULL,
  submission_date timestamptz DEFAULT now(),
  status nabidh_status DEFAULT 'pending',
  nabidh_id text,
  submission_payload jsonb,
  response_payload jsonb,
  error_message text,
  submitted_by uuid REFERENCES lab_technicians(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nabidh_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technicians can view NABIDH submissions"
  ON nabidh_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM samples s
      JOIN lab_technicians lt ON lt.laboratory_id = s.laboratory_id
      WHERE s.id = nabidh_submissions.sample_id
      AND lt.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_samples_laboratory_id ON samples(laboratory_id);
CREATE INDEX IF NOT EXISTS idx_samples_patient_id ON samples(patient_id);
CREATE INDEX IF NOT EXISTS idx_samples_status ON samples(status);
CREATE INDEX IF NOT EXISTS idx_samples_priority ON samples(priority);
CREATE INDEX IF NOT EXISTS idx_samples_barcode ON samples(barcode);
CREATE INDEX IF NOT EXISTS idx_sample_tests_sample_id ON sample_tests(sample_id);
CREATE INDEX IF NOT EXISTS idx_sample_tests_is_critical ON sample_tests(is_critical);
CREATE INDEX IF NOT EXISTS idx_critical_notifications_notified ON critical_value_notifications(notified);
CREATE INDEX IF NOT EXISTS idx_lab_equipment_laboratory_id ON lab_equipment(laboratory_id);
CREATE INDEX IF NOT EXISTS idx_qc_runs_equipment_id ON qc_runs(equipment_id);
CREATE INDEX IF NOT EXISTS idx_qc_runs_result ON qc_runs(result);
CREATE INDEX IF NOT EXISTS idx_nabidh_submissions_status ON nabidh_submissions(status);
