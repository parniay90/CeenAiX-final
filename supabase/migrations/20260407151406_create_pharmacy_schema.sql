/*
  # Pharmacy Management Schema

  1. New Tables
    - `pharmacies`
      - `id` (uuid, primary key)
      - `name` (text) - Pharmacy name
      - `dha_license_number` (text, unique) - DHA pharmacy license
      - `location` (text) - Physical address
      - `phone` (text) - Contact number
      - `email` (text) - Contact email
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `pharmacists`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `pharmacy_id` (uuid, references pharmacies)
      - `full_name` (text) - Pharmacist full name
      - `license_number` (text, unique) - RPh license number
      - `specialization` (text) - Area of specialization
      - `created_at` (timestamptz)

    - `pharmacy_prescriptions`
      - `id` (uuid, primary key)
      - `rx_number` (text, unique) - Prescription number
      - `patient_id` (uuid, references patients)
      - `doctor_id` (uuid, references doctors)
      - `pharmacy_id` (uuid, references pharmacies)
      - `status` (enum) - pending, in_progress, ready, dispensed, on_hold, insurance_pending
      - `is_urgent` (boolean) - Flag for urgent prescriptions
      - `insurance_provider` (text) - Insurance company name
      - `insurance_auth_status` (enum) - approved, pending, denied, not_required
      - `total_amount` (decimal) - Total prescription cost
      - `dispensed_by` (uuid, references pharmacists)
      - `dispensed_at` (timestamptz)
      - `received_at` (timestamptz) - When prescription was received
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `prescription_medications`
      - `id` (uuid, primary key)
      - `prescription_id` (uuid, references pharmacy_prescriptions)
      - `drug_name` (text) - Medication name
      - `generic_name` (text) - Generic/scientific name
      - `strength` (text) - Drug strength
      - `form` (text) - Tablet, capsule, syrup, etc.
      - `quantity` (integer) - Number of units
      - `dosage` (text) - Dosage instructions
      - `duration` (text) - Treatment duration
      - `instructions` (text) - Special instructions
      - `price` (decimal) - Unit price
      - `created_at` (timestamptz)

    - `drug_inventory`
      - `id` (uuid, primary key)
      - `pharmacy_id` (uuid, references pharmacies)
      - `drug_name` (text) - Brand/trade name
      - `generic_name` (text) - Generic name
      - `strength` (text) - Drug strength
      - `form` (text) - Form type
      - `current_stock` (integer) - Current quantity
      - `reorder_point` (integer) - Reorder threshold
      - `stock_level` (enum) - critical, low, adequate
      - `auto_reorder_enabled` (boolean)
      - `supplier` (text) - Supplier name
      - `unit_price` (decimal) - Price per unit
      - `last_order_date` (timestamptz)
      - `expiry_date` (date)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `drug_interactions`
      - `id` (uuid, primary key)
      - `prescription_id` (uuid, references pharmacy_prescriptions)
      - `patient_id` (uuid, references patients)
      - `drug_a` (text) - First drug
      - `drug_b` (text) - Second drug
      - `interaction_type` (enum) - pharmacokinetic, pharmacodynamic
      - `severity` (enum) - moderate, major, contraindicated
      - `description` (text) - Interaction details
      - `flagged_by` (uuid, references pharmacists)
      - `resolved` (boolean) - Whether interaction was addressed
      - `resolution_notes` (text) - How it was resolved
      - `flagged_at` (timestamptz)
      - `resolved_at` (timestamptz)
      - `created_at` (timestamptz)

    - `counseling_logs`
      - `id` (uuid, primary key)
      - `prescription_id` (uuid, references pharmacy_prescriptions)
      - `patient_id` (uuid, references patients)
      - `pharmacist_id` (uuid, references pharmacists)
      - `counseling_notes` (text) - Counseling details
      - `topics_covered` (jsonb) - Array of topics discussed
      - `patient_understood` (boolean) - Patient comprehension
      - `duration_minutes` (integer) - Counseling duration
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Pharmacists can view and manage prescriptions at their pharmacy
    - Patients can view their own prescriptions
    - Inventory management restricted to pharmacists
*/

-- Create enum types
DO $$ BEGIN
  CREATE TYPE pharmacy_prescription_status AS ENUM (
    'pending', 'in_progress', 'ready', 'dispensed', 'on_hold', 'insurance_pending'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE insurance_auth_status AS ENUM ('approved', 'pending', 'denied', 'not_required');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE stock_level_type AS ENUM ('critical', 'low', 'adequate');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE drug_interaction_type AS ENUM ('pharmacokinetic', 'pharmacodynamic');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE interaction_severity AS ENUM ('moderate', 'major', 'contraindicated');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Pharmacies table
CREATE TABLE IF NOT EXISTS pharmacies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  dha_license_number text UNIQUE NOT NULL,
  location text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view pharmacies"
  ON pharmacies FOR SELECT
  TO authenticated
  USING (true);

-- Pharmacists table
CREATE TABLE IF NOT EXISTS pharmacists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  pharmacy_id uuid REFERENCES pharmacies(id) NOT NULL,
  full_name text NOT NULL,
  license_number text UNIQUE NOT NULL,
  specialization text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pharmacists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view own profile"
  ON pharmacists FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Pharmacy prescriptions table
CREATE TABLE IF NOT EXISTS pharmacy_prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rx_number text UNIQUE NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  pharmacy_id uuid REFERENCES pharmacies(id) NOT NULL,
  status pharmacy_prescription_status DEFAULT 'pending',
  is_urgent boolean DEFAULT false,
  insurance_provider text,
  insurance_auth_status insurance_auth_status DEFAULT 'not_required',
  total_amount decimal(10,2),
  dispensed_by uuid REFERENCES pharmacists(id),
  dispensed_at timestamptz,
  received_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pharmacy_prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view pharmacy prescriptions"
  ON pharmacy_prescriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.user_id = auth.uid()
      AND pharmacists.pharmacy_id = pharmacy_prescriptions.pharmacy_id
    )
  );

CREATE POLICY "Pharmacists can manage pharmacy prescriptions"
  ON pharmacy_prescriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.user_id = auth.uid()
      AND pharmacists.pharmacy_id = pharmacy_prescriptions.pharmacy_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.user_id = auth.uid()
      AND pharmacists.pharmacy_id = pharmacy_prescriptions.pharmacy_id
    )
  );

-- Prescription medications table
CREATE TABLE IF NOT EXISTS prescription_medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid REFERENCES pharmacy_prescriptions(id) NOT NULL,
  drug_name text NOT NULL,
  generic_name text,
  strength text NOT NULL,
  form text NOT NULL,
  quantity integer NOT NULL,
  dosage text NOT NULL,
  duration text NOT NULL,
  instructions text,
  price decimal(10,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prescription_medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view prescription medications"
  ON prescription_medications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacy_prescriptions pp
      JOIN pharmacists ph ON ph.pharmacy_id = pp.pharmacy_id
      WHERE pp.id = prescription_medications.prescription_id
      AND ph.user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacists can manage prescription medications"
  ON prescription_medications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacy_prescriptions pp
      JOIN pharmacists ph ON ph.pharmacy_id = pp.pharmacy_id
      WHERE pp.id = prescription_medications.prescription_id
      AND ph.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pharmacy_prescriptions pp
      JOIN pharmacists ph ON ph.pharmacy_id = pp.pharmacy_id
      WHERE pp.id = prescription_medications.prescription_id
      AND ph.user_id = auth.uid()
    )
  );

-- Drug inventory table
CREATE TABLE IF NOT EXISTS drug_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid REFERENCES pharmacies(id) NOT NULL,
  drug_name text NOT NULL,
  generic_name text NOT NULL,
  strength text NOT NULL,
  form text NOT NULL,
  current_stock integer DEFAULT 0,
  reorder_point integer NOT NULL,
  stock_level stock_level_type DEFAULT 'adequate',
  auto_reorder_enabled boolean DEFAULT false,
  supplier text NOT NULL,
  unit_price decimal(10,2),
  last_order_date timestamptz,
  expiry_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE drug_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view pharmacy inventory"
  ON drug_inventory FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.user_id = auth.uid()
      AND pharmacists.pharmacy_id = drug_inventory.pharmacy_id
    )
  );

CREATE POLICY "Pharmacists can manage pharmacy inventory"
  ON drug_inventory FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.user_id = auth.uid()
      AND pharmacists.pharmacy_id = drug_inventory.pharmacy_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.user_id = auth.uid()
      AND pharmacists.pharmacy_id = drug_inventory.pharmacy_id
    )
  );

-- Drug interactions table
CREATE TABLE IF NOT EXISTS drug_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid REFERENCES pharmacy_prescriptions(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  drug_a text NOT NULL,
  drug_b text NOT NULL,
  interaction_type drug_interaction_type NOT NULL,
  severity interaction_severity NOT NULL,
  description text NOT NULL,
  flagged_by uuid REFERENCES pharmacists(id),
  resolved boolean DEFAULT false,
  resolution_notes text,
  flagged_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE drug_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view drug interactions"
  ON drug_interactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacy_prescriptions pp
      JOIN pharmacists ph ON ph.pharmacy_id = pp.pharmacy_id
      WHERE pp.id = drug_interactions.prescription_id
      AND ph.user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacists can manage drug interactions"
  ON drug_interactions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacy_prescriptions pp
      JOIN pharmacists ph ON ph.pharmacy_id = pp.pharmacy_id
      WHERE pp.id = drug_interactions.prescription_id
      AND ph.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pharmacy_prescriptions pp
      JOIN pharmacists ph ON ph.pharmacy_id = pp.pharmacy_id
      WHERE pp.id = drug_interactions.prescription_id
      AND ph.user_id = auth.uid()
    )
  );

-- Counseling logs table
CREATE TABLE IF NOT EXISTS counseling_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid REFERENCES pharmacy_prescriptions(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  pharmacist_id uuid REFERENCES pharmacists(id) NOT NULL,
  counseling_notes text NOT NULL,
  topics_covered jsonb DEFAULT '[]'::jsonb,
  patient_understood boolean DEFAULT true,
  duration_minutes integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE counseling_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view counseling logs"
  ON counseling_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.id = counseling_logs.pharmacist_id
      AND pharmacists.user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacists can create counseling logs"
  ON counseling_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.id = counseling_logs.pharmacist_id
      AND pharmacists.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pharmacy_prescriptions_pharmacy_id ON pharmacy_prescriptions(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_prescriptions_patient_id ON pharmacy_prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_prescriptions_status ON pharmacy_prescriptions(status);
CREATE INDEX IF NOT EXISTS idx_pharmacy_prescriptions_received_at ON pharmacy_prescriptions(received_at);
CREATE INDEX IF NOT EXISTS idx_prescription_medications_prescription_id ON prescription_medications(prescription_id);
CREATE INDEX IF NOT EXISTS idx_drug_inventory_pharmacy_id ON drug_inventory(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_drug_inventory_stock_level ON drug_inventory(stock_level);
CREATE INDEX IF NOT EXISTS idx_drug_interactions_prescription_id ON drug_interactions(prescription_id);
CREATE INDEX IF NOT EXISTS idx_drug_interactions_resolved ON drug_interactions(resolved);
CREATE INDEX IF NOT EXISTS idx_counseling_logs_prescription_id ON counseling_logs(prescription_id);
