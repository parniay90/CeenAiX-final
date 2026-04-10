/*
  # CeenAiX Patient Registration Schema

  1. New Tables
    - `patients`
      - `id` (uuid, primary key)
      - `emirates_id` (text, unique) - 15-digit Emirates ID
      - `full_name_english` (text) - Full name in English
      - `full_name_arabic` (text) - Full name in Arabic
      - `date_of_birth` (date) - Patient date of birth
      - `gender` (text) - Male/Female
      - `nationality` (text) - Country of nationality
      - `phone` (text) - UAE phone number
      - `email` (text, unique) - Email address
      - `emergency_contact_name` (text) - Emergency contact full name
      - `emergency_contact_phone` (text) - Emergency contact phone
      - `residency_status` (text) - UAE National/UAE Resident/Medical Tourist
      - `insurance_provider` (text) - Insurance company name
      - `insurance_card_number` (text) - Insurance policy number
      - `pre_existing_conditions` (jsonb) - Array of conditions
      - `current_medications` (text) - Current medications list
      - `allergies` (jsonb) - Array of allergies
      - `blood_type` (text) - Blood type (A+, B-, etc.)
      - `preferred_language` (text) - Preferred communication language
      - `preferred_communication` (jsonb) - Array of communication methods
      - `health_goals` (jsonb) - Array of health goals
      - `preferred_gp` (text) - Optional GP/Family doctor
      - `dha_consent` (boolean) - DHA data sharing consent
      - `nabidh_enrolled` (boolean) - NABIDH HIE enrollment
      - `ai_assistant_consent` (boolean) - AI health assistant consent
      - `terms_accepted` (boolean) - Terms and conditions acceptance
      - `onboarding_completed` (boolean) - Whether onboarding is complete
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `patients` table
    - Add policies for authenticated users to manage their own patient records
*/

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  emirates_id text UNIQUE NOT NULL,
  full_name_english text NOT NULL,
  full_name_arabic text,
  date_of_birth date NOT NULL,
  gender text NOT NULL,
  nationality text NOT NULL,
  phone text NOT NULL,
  email text UNIQUE NOT NULL,
  emergency_contact_name text NOT NULL,
  emergency_contact_phone text NOT NULL,
  residency_status text NOT NULL,
  insurance_provider text,
  insurance_card_number text,
  pre_existing_conditions jsonb DEFAULT '[]'::jsonb,
  current_medications text,
  allergies jsonb DEFAULT '[]'::jsonb,
  blood_type text,
  preferred_language text NOT NULL DEFAULT 'English',
  preferred_communication jsonb DEFAULT '[]'::jsonb,
  health_goals jsonb DEFAULT '[]'::jsonb,
  preferred_gp text,
  dha_consent boolean NOT NULL DEFAULT false,
  nabidh_enrolled boolean DEFAULT false,
  ai_assistant_consent boolean DEFAULT false,
  terms_accepted boolean NOT NULL DEFAULT false,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own patient record"
  ON patients FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own patient record"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own patient record"
  ON patients FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can create patient records during registration"
  ON patients FOR INSERT
  TO anon
  WITH CHECK (true);