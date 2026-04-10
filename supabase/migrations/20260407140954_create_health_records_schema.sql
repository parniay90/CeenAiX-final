/*
  # CeenAiX Health Records Schema

  1. New Tables
    - `health_timeline_events`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `event_type` (text) - visit/diagnosis/prescription/lab
      - `event_title` (text) - Event description
      - `provider_name` (text) - Healthcare provider
      - `event_date` (timestamptz) - When event occurred
      - `details` (jsonb) - Additional event details
      - `created_at` (timestamptz)

    - `active_conditions`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `condition_name` (text) - Condition/diagnosis name
      - `icd10_code` (text) - ICD-10 diagnosis code
      - `onset_date` (date) - When condition started
      - `managing_doctor` (text) - Doctor managing condition
      - `status` (text) - Active/Controlled/Resolved
      - `notes` (text) - Additional notes
      - `created_at` (timestamptz)

    - `patient_medications`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `drug_name` (text) - Brand/trade name
      - `generic_name` (text) - Generic name
      - `dosage` (text) - Dosage information
      - `frequency` (text) - How often to take
      - `prescribing_doctor` (text) - Doctor who prescribed
      - `prescribed_date` (date) - When prescribed
      - `refill_date` (date) - Next refill due
      - `quantity_remaining` (integer) - Pills/doses remaining
      - `total_quantity` (integer) - Total per prescription
      - `status` (text) - Active/Stopped/NeedsRefill
      - `interaction_warnings` (jsonb) - Drug interaction alerts
      - `created_at` (timestamptz)

    - `patient_allergies`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `allergen_name` (text) - What causes allergy
      - `category` (text) - Drug/Food/Environmental/Latex
      - `reaction_description` (text) - Reaction details
      - `severity` (text) - Mild/Moderate/Severe/Anaphylaxis
      - `discovery_date` (date) - When discovered
      - `on_emergency_card` (boolean) - Show on emergency ID
      - `created_at` (timestamptz)

    - `lab_results`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `test_name` (text) - Name of lab test
      - `test_type` (text) - Category of test
      - `collection_date` (timestamptz) - Sample collection date
      - `lab_name` (text) - Laboratory name
      - `result_value` (text) - Test result
      - `reference_range` (text) - Normal range
      - `unit` (text) - Unit of measurement
      - `status` (text) - Normal/Abnormal/Critical
      - `ai_interpretation` (text) - AI-generated insight
      - `file_url` (text) - PDF report URL
      - `created_at` (timestamptz)

    - `vitals_log`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `recorded_at` (timestamptz) - When vital was recorded
      - `systolic_bp` (integer) - Systolic blood pressure
      - `diastolic_bp` (integer) - Diastolic blood pressure
      - `heart_rate` (integer) - Heart rate (bpm)
      - `blood_sugar` (integer) - Blood glucose (mg/dL)
      - `blood_sugar_timing` (text) - pre_meal/post_meal/fasting
      - `weight` (decimal) - Weight in kg
      - `temperature` (decimal) - Temperature in celsius
      - `spo2` (integer) - Blood oxygen saturation (%)
      - `source` (text) - manual/apple_health/google_fit/fitbit
      - `created_at` (timestamptz)

    - `vaccinations`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key to patients)
      - `vaccine_name` (text) - Vaccine name
      - `disease_target` (text) - What disease it prevents
      - `dose_number` (integer) - Dose sequence number
      - `administration_date` (date) - When administered
      - `administrator` (text) - Who gave the vaccine
      - `location` (text) - Where it was given
      - `lot_number` (text) - Vaccine lot number
      - `next_dose_due` (date) - When next dose is due
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to access their own data
*/

CREATE TABLE IF NOT EXISTS health_timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_title text NOT NULL,
  provider_name text NOT NULL,
  event_date timestamptz NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS active_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  condition_name text NOT NULL,
  icd10_code text,
  onset_date date NOT NULL,
  managing_doctor text NOT NULL,
  status text NOT NULL DEFAULT 'Active',
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patient_medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  drug_name text NOT NULL,
  generic_name text,
  dosage text NOT NULL,
  frequency text NOT NULL,
  prescribing_doctor text NOT NULL,
  prescribed_date date NOT NULL,
  refill_date date,
  quantity_remaining integer DEFAULT 0,
  total_quantity integer DEFAULT 0,
  status text NOT NULL DEFAULT 'Active',
  interaction_warnings jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patient_allergies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  allergen_name text NOT NULL,
  category text NOT NULL,
  reaction_description text NOT NULL,
  severity text NOT NULL,
  discovery_date date NOT NULL,
  on_emergency_card boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lab_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  test_name text NOT NULL,
  test_type text NOT NULL,
  collection_date timestamptz NOT NULL,
  lab_name text NOT NULL,
  result_value text NOT NULL,
  reference_range text,
  unit text,
  status text NOT NULL DEFAULT 'Normal',
  ai_interpretation text,
  file_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vitals_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  recorded_at timestamptz NOT NULL,
  systolic_bp integer,
  diastolic_bp integer,
  heart_rate integer,
  blood_sugar integer,
  blood_sugar_timing text,
  weight decimal(5,2),
  temperature decimal(4,2),
  spo2 integer,
  source text DEFAULT 'manual',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vaccinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  vaccine_name text NOT NULL,
  disease_target text NOT NULL,
  dose_number integer DEFAULT 1,
  administration_date date NOT NULL,
  administrator text NOT NULL,
  location text,
  lot_number text,
  next_dose_due date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitals_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own health timeline"
  ON health_timeline_events FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can view their own active conditions"
  ON active_conditions FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can view their own medications"
  ON patient_medications FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can view their own allergies"
  ON patient_allergies FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can insert their own allergies"
  ON patient_allergies FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Users can view their own lab results"
  ON lab_results FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can view their own vitals"
  ON vitals_log FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Users can insert their own vitals"
  ON vitals_log FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Users can view their own vaccinations"
  ON vaccinations FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());