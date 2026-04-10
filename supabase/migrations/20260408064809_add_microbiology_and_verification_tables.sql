/*
  # Add Microbiology and Verification Support

  1. New Tables
    - `microbiology_organisms`
      - `id` (uuid, primary key)
      - `sample_test_id` (uuid, references sample_tests)
      - `organism_name` (text) - E.g., Escherichia coli
      - `atcc_code` (text) - Standard reference code
      - `colony_count` (text) - E.g., 10^5 CFU/mL
      - `created_at` (timestamptz)

    - `antibiotic_sensitivities`
      - `id` (uuid, primary key)
      - `organism_id` (uuid, references microbiology_organisms)
      - `antibiotic_name` (text)
      - `antibiotic_code` (text) - E.g., CIP, AMP
      - `result` (enum) - S (Susceptible), I (Intermediate), R (Resistant), ND (Not Done)
      - `mic_value` (text) - Minimum Inhibitory Concentration
      - `created_at` (timestamptz)

    - `result_verifications`
      - `id` (uuid, primary key)
      - `sample_id` (uuid, references samples)
      - `technician_name` (text)
      - `technician_id` (uuid, references lab_technicians)
      - `supervisor_name` (text)
      - `supervisor_id` (uuid, references lab_technicians)
      - `supervisor_acknowledged` (boolean)
      - `override_reason` (text)
      - `verification_timestamp` (timestamptz)
      - `created_at` (timestamptz)

    - `result_audit_trail`
      - `id` (uuid, primary key)
      - `sample_id` (uuid, references samples)
      - `action` (text) - E.g., "Results Verified", "NABIDH Submitted"
      - `performed_by` (text)
      - `performed_by_id` (uuid)
      - `details` (text)
      - `timestamp` (timestamptz)
      - `created_at` (timestamptz)

  2. Enhancements
    - Add `method` column to sample_tests for test methodology
    - Add `instrument_id` reference to sample_tests
    - Add result notification tracking columns

  3. Security
    - Enable RLS on all new tables
    - Technicians can only access records for their laboratory
    - Audit trail is append-only (no updates/deletes)
    - Verification records are immutable after creation
*/

-- Create enum for antibiotic sensitivity results
DO $$ BEGIN
  CREATE TYPE sensitivity_result AS ENUM ('S', 'I', 'R', 'ND');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add columns to existing sample_tests table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sample_tests' AND column_name = 'method'
  ) THEN
    ALTER TABLE sample_tests ADD COLUMN method text DEFAULT 'Automated';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sample_tests' AND column_name = 'instrument_id'
  ) THEN
    ALTER TABLE sample_tests ADD COLUMN instrument_id uuid REFERENCES lab_equipment(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sample_tests' AND column_name = 'comment'
  ) THEN
    ALTER TABLE sample_tests ADD COLUMN comment text;
  END IF;
END $$;

-- Microbiology organisms table
CREATE TABLE IF NOT EXISTS microbiology_organisms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_test_id uuid REFERENCES sample_tests(id) NOT NULL,
  organism_name text NOT NULL,
  atcc_code text,
  colony_count text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE microbiology_organisms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technicians can view organisms"
  ON microbiology_organisms FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sample_tests st
      JOIN samples s ON s.id = st.sample_id
      JOIN lab_technicians lt ON lt.laboratory_id = s.laboratory_id
      WHERE st.id = microbiology_organisms.sample_test_id
      AND lt.user_id = auth.uid()
    )
  );

CREATE POLICY "Technicians can manage organisms"
  ON microbiology_organisms FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sample_tests st
      JOIN samples s ON s.id = st.sample_id
      JOIN lab_technicians lt ON lt.laboratory_id = s.laboratory_id
      WHERE st.id = microbiology_organisms.sample_test_id
      AND lt.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sample_tests st
      JOIN samples s ON s.id = st.sample_id
      JOIN lab_technicians lt ON lt.laboratory_id = s.laboratory_id
      WHERE st.id = microbiology_organisms.sample_test_id
      AND lt.user_id = auth.uid()
    )
  );

-- Antibiotic sensitivities table
CREATE TABLE IF NOT EXISTS antibiotic_sensitivities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organism_id uuid REFERENCES microbiology_organisms(id) ON DELETE CASCADE NOT NULL,
  antibiotic_name text NOT NULL,
  antibiotic_code text NOT NULL,
  result sensitivity_result DEFAULT 'ND',
  mic_value text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE antibiotic_sensitivities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technicians can view sensitivities"
  ON antibiotic_sensitivities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM microbiology_organisms mo
      JOIN sample_tests st ON st.id = mo.sample_test_id
      JOIN samples s ON s.id = st.sample_id
      JOIN lab_technicians lt ON lt.laboratory_id = s.laboratory_id
      WHERE mo.id = antibiotic_sensitivities.organism_id
      AND lt.user_id = auth.uid()
    )
  );

CREATE POLICY "Technicians can manage sensitivities"
  ON antibiotic_sensitivities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM microbiology_organisms mo
      JOIN sample_tests st ON st.id = mo.sample_test_id
      JOIN samples s ON s.id = st.sample_id
      JOIN lab_technicians lt ON lt.laboratory_id = s.laboratory_id
      WHERE mo.id = antibiotic_sensitivities.organism_id
      AND lt.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM microbiology_organisms mo
      JOIN sample_tests st ON st.id = mo.sample_test_id
      JOIN samples s ON s.id = st.sample_id
      JOIN lab_technicians lt ON lt.laboratory_id = s.laboratory_id
      WHERE mo.id = antibiotic_sensitivities.organism_id
      AND lt.user_id = auth.uid()
    )
  );

-- Result verifications table
CREATE TABLE IF NOT EXISTS result_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_id uuid REFERENCES samples(id) NOT NULL,
  technician_name text NOT NULL,
  technician_id uuid REFERENCES lab_technicians(id) NOT NULL,
  supervisor_name text,
  supervisor_id uuid REFERENCES lab_technicians(id),
  supervisor_acknowledged boolean DEFAULT false,
  override_reason text,
  verification_timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE result_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technicians can view verifications"
  ON result_verifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM samples s
      JOIN lab_technicians lt ON lt.laboratory_id = s.laboratory_id
      WHERE s.id = result_verifications.sample_id
      AND lt.user_id = auth.uid()
    )
  );

CREATE POLICY "Technicians can create verifications"
  ON result_verifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lab_technicians
      WHERE lab_technicians.id = result_verifications.technician_id
      AND lab_technicians.user_id = auth.uid()
    )
  );

-- Result audit trail table
CREATE TABLE IF NOT EXISTS result_audit_trail (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_id uuid REFERENCES samples(id) NOT NULL,
  action text NOT NULL,
  performed_by text NOT NULL,
  performed_by_id uuid,
  details text,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE result_audit_trail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Technicians can view audit trail"
  ON result_audit_trail FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM samples s
      JOIN lab_technicians lt ON lt.laboratory_id = s.laboratory_id
      WHERE s.id = result_audit_trail.sample_id
      AND lt.user_id = auth.uid()
    )
  );

CREATE POLICY "Technicians can append to audit trail"
  ON result_audit_trail FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM samples s
      JOIN lab_technicians lt ON lt.laboratory_id = s.laboratory_id
      WHERE s.id = result_audit_trail.sample_id
      AND lt.user_id = auth.uid()
    )
  );

-- Add notification tracking columns to samples
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'samples' AND column_name = 'doctor_notified_at'
  ) THEN
    ALTER TABLE samples ADD COLUMN doctor_notified_at timestamptz;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'samples' AND column_name = 'patient_notified_at'
  ) THEN
    ALTER TABLE samples ADD COLUMN patient_notified_at timestamptz;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_microbiology_organisms_sample_test_id ON microbiology_organisms(sample_test_id);
CREATE INDEX IF NOT EXISTS idx_antibiotic_sensitivities_organism_id ON antibiotic_sensitivities(organism_id);
CREATE INDEX IF NOT EXISTS idx_result_verifications_sample_id ON result_verifications(sample_id);
CREATE INDEX IF NOT EXISTS idx_result_audit_trail_sample_id ON result_audit_trail(sample_id);
CREATE INDEX IF NOT EXISTS idx_result_audit_trail_timestamp ON result_audit_trail(timestamp);
