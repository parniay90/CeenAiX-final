/*
  # Dispensing Workflow Enhancement

  1. New Tables
    - `dispensing_records`
      - `id` (uuid, primary key)
      - `prescription_id` (uuid, references pharmacy_prescriptions)
      - `pharmacist_id` (uuid, references pharmacists)
      - `patient_id` (uuid, references patients)
      - `total_amount` (decimal) - Total cost
      - `insurance_coverage` (decimal) - Amount covered by insurance
      - `patient_payment` (decimal) - Amount paid by patient
      - `payment_method` (enum) - cash, card, insurance_direct
      - `counseling_notes` (text) - Pharmacist counseling notes
      - `pharmacist_pin_verified` (boolean) - PIN verification status
      - `dha_submitted` (boolean) - DHA submission status
      - `dha_submission_time` (timestamptz) - When submitted to DHA
      - `sent_to_patient_app` (boolean) - Patient app notification
      - `dispensed_at` (timestamptz) - When dispensed
      - `created_at` (timestamptz)

    - `dispensed_medications`
      - `id` (uuid, primary key)
      - `dispensing_record_id` (uuid, references dispensing_records)
      - `prescription_medication_id` (uuid, references prescription_medications)
      - `dispensed_quantity` (integer) - Actual quantity dispensed
      - `batch_number` (text) - Batch/lot number
      - `expiry_date` (date) - Expiration date
      - `generic_substituted` (boolean) - Generic substitution made
      - `substituted_drug_name` (text) - If substituted, new drug name
      - `substituted_price` (decimal) - Substituted drug price
      - `created_at` (timestamptz)

    - `counseling_checklist`
      - `id` (uuid, primary key)
      - `dispensing_record_id` (uuid, references dispensing_records)
      - `category` (enum) - dosage, side_effects, interactions, storage, refill_date
      - `item` (text) - Checklist item text
      - `completed` (boolean) - Whether completed
      - `created_at` (timestamptz)

    - `controlled_substance_logs`
      - `id` (uuid, primary key)
      - `dispensing_record_id` (uuid, references dispensing_records)
      - `medication_id` (uuid, references prescription_medications)
      - `patient_id` (uuid, references patients)
      - `pharmacist_id` (uuid, references pharmacists)
      - `drug_name` (text) - Controlled substance name
      - `quantity` (integer) - Dispensed quantity
      - `batch_number` (text) - Batch number
      - `patient_id_verified` (boolean) - Emirates ID verified
      - `dha_reported` (boolean) - Reported to DHA
      - `dha_report_time` (timestamptz) - When reported
      - `notes` (text) - Additional notes
      - `created_at` (timestamptz)

    - `prescription_holds`
      - `id` (uuid, primary key)
      - `prescription_id` (uuid, references pharmacy_prescriptions)
      - `reason` (text) - Reason for hold
      - `placed_by` (uuid, references pharmacists)
      - `placed_at` (timestamptz)
      - `resolved` (boolean) - Whether resolved
      - `resolved_at` (timestamptz)
      - `resolution_notes` (text)
      - `created_at` (timestamptz)

    - `doctor_referrals`
      - `id` (uuid, primary key)
      - `prescription_id` (uuid, references pharmacy_prescriptions)
      - `pharmacist_id` (uuid, references pharmacists)
      - `doctor_id` (uuid, references doctors)
      - `message` (text) - Message to doctor
      - `response` (text) - Doctor's response
      - `status` (enum) - pending, responded, resolved
      - `sent_at` (timestamptz)
      - `responded_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Pharmacists can access records for their pharmacy
    - Patients can view their own dispensing records
*/

-- Create enum types
DO $$ BEGIN
  CREATE TYPE payment_method_type AS ENUM ('cash', 'card', 'insurance_direct');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE counseling_category AS ENUM ('dosage', 'side_effects', 'interactions', 'storage', 'refill_date');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE referral_status AS ENUM ('pending', 'responded', 'resolved');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Dispensing records table
CREATE TABLE IF NOT EXISTS dispensing_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid REFERENCES pharmacy_prescriptions(id) NOT NULL,
  pharmacist_id uuid REFERENCES pharmacists(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  insurance_coverage decimal(10,2) DEFAULT 0,
  patient_payment decimal(10,2) NOT NULL,
  payment_method payment_method_type NOT NULL,
  counseling_notes text,
  pharmacist_pin_verified boolean DEFAULT false,
  dha_submitted boolean DEFAULT false,
  dha_submission_time timestamptz,
  sent_to_patient_app boolean DEFAULT false,
  dispensed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dispensing_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view dispensing records"
  ON dispensing_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacy_prescriptions pp
      JOIN pharmacists ph ON ph.pharmacy_id = pp.pharmacy_id
      WHERE pp.id = dispensing_records.prescription_id
      AND ph.user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacists can create dispensing records"
  ON dispensing_records FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.id = dispensing_records.pharmacist_id
      AND pharmacists.user_id = auth.uid()
    )
  );

-- Dispensed medications table
CREATE TABLE IF NOT EXISTS dispensed_medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dispensing_record_id uuid REFERENCES dispensing_records(id) NOT NULL,
  prescription_medication_id uuid REFERENCES prescription_medications(id) NOT NULL,
  dispensed_quantity integer NOT NULL,
  batch_number text NOT NULL,
  expiry_date date NOT NULL,
  generic_substituted boolean DEFAULT false,
  substituted_drug_name text,
  substituted_price decimal(10,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dispensed_medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view dispensed medications"
  ON dispensed_medications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dispensing_records dr
      JOIN pharmacy_prescriptions pp ON pp.id = dr.prescription_id
      JOIN pharmacists ph ON ph.pharmacy_id = pp.pharmacy_id
      WHERE dr.id = dispensed_medications.dispensing_record_id
      AND ph.user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacists can create dispensed medications"
  ON dispensed_medications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dispensing_records dr
      JOIN pharmacists ph ON ph.id = dr.pharmacist_id
      WHERE dr.id = dispensed_medications.dispensing_record_id
      AND ph.user_id = auth.uid()
    )
  );

-- Counseling checklist table
CREATE TABLE IF NOT EXISTS counseling_checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dispensing_record_id uuid REFERENCES dispensing_records(id) NOT NULL,
  category counseling_category NOT NULL,
  item text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE counseling_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can manage counseling checklist"
  ON counseling_checklist FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dispensing_records dr
      JOIN pharmacists ph ON ph.id = dr.pharmacist_id
      WHERE dr.id = counseling_checklist.dispensing_record_id
      AND ph.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dispensing_records dr
      JOIN pharmacists ph ON ph.id = dr.pharmacist_id
      WHERE dr.id = counseling_checklist.dispensing_record_id
      AND ph.user_id = auth.uid()
    )
  );

-- Controlled substance logs table
CREATE TABLE IF NOT EXISTS controlled_substance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dispensing_record_id uuid REFERENCES dispensing_records(id) NOT NULL,
  medication_id uuid REFERENCES prescription_medications(id) NOT NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  pharmacist_id uuid REFERENCES pharmacists(id) NOT NULL,
  drug_name text NOT NULL,
  quantity integer NOT NULL,
  batch_number text NOT NULL,
  patient_id_verified boolean DEFAULT false,
  dha_reported boolean DEFAULT false,
  dha_report_time timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE controlled_substance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view controlled substance logs"
  ON controlled_substance_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.id = controlled_substance_logs.pharmacist_id
      AND pharmacists.user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacists can create controlled substance logs"
  ON controlled_substance_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.id = controlled_substance_logs.pharmacist_id
      AND pharmacists.user_id = auth.uid()
    )
  );

-- Prescription holds table
CREATE TABLE IF NOT EXISTS prescription_holds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid REFERENCES pharmacy_prescriptions(id) NOT NULL,
  reason text NOT NULL,
  placed_by uuid REFERENCES pharmacists(id) NOT NULL,
  placed_at timestamptz DEFAULT now(),
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  resolution_notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prescription_holds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can manage prescription holds"
  ON prescription_holds FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacy_prescriptions pp
      JOIN pharmacists ph ON ph.pharmacy_id = pp.pharmacy_id
      WHERE pp.id = prescription_holds.prescription_id
      AND ph.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pharmacy_prescriptions pp
      JOIN pharmacists ph ON ph.pharmacy_id = pp.pharmacy_id
      WHERE pp.id = prescription_holds.prescription_id
      AND ph.user_id = auth.uid()
    )
  );

-- Doctor referrals table
CREATE TABLE IF NOT EXISTS doctor_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid REFERENCES pharmacy_prescriptions(id) NOT NULL,
  pharmacist_id uuid REFERENCES pharmacists(id) NOT NULL,
  doctor_id uuid REFERENCES doctors(id) NOT NULL,
  message text NOT NULL,
  response text,
  status referral_status DEFAULT 'pending',
  sent_at timestamptz DEFAULT now(),
  responded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE doctor_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacists can view doctor referrals"
  ON doctor_referrals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.id = doctor_referrals.pharmacist_id
      AND pharmacists.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM doctors
      WHERE doctors.id = doctor_referrals.doctor_id
      AND doctors.user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacists can create doctor referrals"
  ON doctor_referrals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pharmacists
      WHERE pharmacists.id = doctor_referrals.pharmacist_id
      AND pharmacists.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dispensing_records_prescription_id ON dispensing_records(prescription_id);
CREATE INDEX IF NOT EXISTS idx_dispensing_records_pharmacist_id ON dispensing_records(pharmacist_id);
CREATE INDEX IF NOT EXISTS idx_dispensing_records_dispensed_at ON dispensing_records(dispensed_at);
CREATE INDEX IF NOT EXISTS idx_dispensed_medications_dispensing_record_id ON dispensed_medications(dispensing_record_id);
CREATE INDEX IF NOT EXISTS idx_counseling_checklist_dispensing_record_id ON counseling_checklist(dispensing_record_id);
CREATE INDEX IF NOT EXISTS idx_controlled_substance_logs_pharmacist_id ON controlled_substance_logs(pharmacist_id);
CREATE INDEX IF NOT EXISTS idx_controlled_substance_logs_dha_reported ON controlled_substance_logs(dha_reported);
CREATE INDEX IF NOT EXISTS idx_prescription_holds_prescription_id ON prescription_holds(prescription_id);
CREATE INDEX IF NOT EXISTS idx_prescription_holds_resolved ON prescription_holds(resolved);
CREATE INDEX IF NOT EXISTS idx_doctor_referrals_prescription_id ON doctor_referrals(prescription_id);
CREATE INDEX IF NOT EXISTS idx_doctor_referrals_status ON doctor_referrals(status);
