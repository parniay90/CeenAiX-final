/*
  # Add Organization Management Schema

  1. New Tables
    - `organization_contracts`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references platform_organizations)
      - `plan_name` (text) - Enterprise, Professional, Standard
      - `start_date` (date)
      - `renewal_date` (date)
      - `payment_status` (enum) - paid, pending, overdue
      - `created_at` (timestamptz)

    - `organization_contacts`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references platform_organizations)
      - `contact_type` (enum) - primary, technical, billing
      - `name` (text)
      - `phone` (text)
      - `email` (text)
      - `created_at` (timestamptz)

    - `organization_users`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references platform_organizations)
      - `user_id` (uuid, references auth.users)
      - `role` (text)
      - `dha_license` (text, optional)
      - `status` (enum) - active, inactive, suspended
      - `last_login` (timestamptz)
      - `created_at` (timestamptz)

    - `onboarding_checklist_items`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references platform_organizations)
      - `item_label` (text)
      - `completed` (boolean)
      - `completed_date` (timestamptz, optional)
      - `created_at` (timestamptz)

    - `portal_access_config`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references platform_organizations)
      - `portal_id` (text) - doctor, pharmacy, laboratory, patient, admin
      - `portal_name` (text)
      - `enabled` (boolean)
      - `features` (jsonb) - Array of {featureId, featureName, enabled}
      - `created_at` (timestamptz)

    - `compliance_items`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references platform_organizations)
      - `title` (text)
      - `description` (text)
      - `status` (enum) - compliant, pending, overdue
      - `due_date` (date, optional)
      - `created_at` (timestamptz)

  2. Updates to Existing Tables
    - Add columns to `platform_organizations`:
      - `legal_name` (text)
      - `trade_license` (text)
      - `facility_type` (text)
      - `address` (text)
      - `insurance_network_participation` (boolean)
      - `onboarding_progress` (integer) - percentage 0-100

  3. Security
    - Enable RLS on all new tables
    - Platform admins can manage all records
    - Organization users can view their own organization's data

  4. Indexes
    - Organization ID indexes for all child tables
    - User lookup indexes
*/

-- Create enums
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'overdue');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE contact_type AS ENUM ('primary', 'technical', 'billing');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE compliance_status AS ENUM ('compliant', 'pending', 'overdue');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add columns to platform_organizations
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platform_organizations' AND column_name = 'legal_name') THEN
    ALTER TABLE platform_organizations ADD COLUMN legal_name text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platform_organizations' AND column_name = 'trade_license') THEN
    ALTER TABLE platform_organizations ADD COLUMN trade_license text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platform_organizations' AND column_name = 'facility_type') THEN
    ALTER TABLE platform_organizations ADD COLUMN facility_type text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platform_organizations' AND column_name = 'address') THEN
    ALTER TABLE platform_organizations ADD COLUMN address text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platform_organizations' AND column_name = 'insurance_network_participation') THEN
    ALTER TABLE platform_organizations ADD COLUMN insurance_network_participation boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platform_organizations' AND column_name = 'onboarding_progress') THEN
    ALTER TABLE platform_organizations ADD COLUMN onboarding_progress integer DEFAULT 0 CHECK (onboarding_progress >= 0 AND onboarding_progress <= 100);
  END IF;
END $$;

-- Organization contracts table
CREATE TABLE IF NOT EXISTS organization_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES platform_organizations(id) NOT NULL,
  plan_name text NOT NULL,
  start_date date NOT NULL,
  renewal_date date NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE organization_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view contracts"
  ON organization_contracts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Platform admins can manage contracts"
  ON organization_contracts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
      AND platform_admins.role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
      AND platform_admins.role = 'super_admin'
    )
  );

-- Organization contacts table
CREATE TABLE IF NOT EXISTS organization_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES platform_organizations(id) NOT NULL,
  contact_type contact_type NOT NULL,
  name text NOT NULL,
  phone text,
  email text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE organization_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view contacts"
  ON organization_contacts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Platform admins can manage contacts"
  ON organization_contacts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

-- Organization users table
CREATE TABLE IF NOT EXISTS organization_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES platform_organizations(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  role text NOT NULL,
  dha_license text,
  status user_status DEFAULT 'active',
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

ALTER TABLE organization_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view org users"
  ON organization_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Platform admins can manage org users"
  ON organization_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

-- Onboarding checklist items table
CREATE TABLE IF NOT EXISTS onboarding_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES platform_organizations(id) NOT NULL,
  item_label text NOT NULL,
  completed boolean DEFAULT false,
  completed_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE onboarding_checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view checklist items"
  ON onboarding_checklist_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Platform admins can manage checklist items"
  ON onboarding_checklist_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

-- Portal access configuration table
CREATE TABLE IF NOT EXISTS portal_access_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES platform_organizations(id) NOT NULL,
  portal_id text NOT NULL,
  portal_name text NOT NULL,
  enabled boolean DEFAULT false,
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, portal_id)
);

ALTER TABLE portal_access_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view portal access"
  ON portal_access_config FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Platform admins can manage portal access"
  ON portal_access_config FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

-- Compliance items table
CREATE TABLE IF NOT EXISTS compliance_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES platform_organizations(id) NOT NULL,
  title text NOT NULL,
  description text,
  status compliance_status DEFAULT 'pending',
  due_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE compliance_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view compliance items"
  ON compliance_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Platform admins can manage compliance items"
  ON compliance_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_org_contracts_org_id ON organization_contracts(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_contacts_org_id ON organization_contacts(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_users_org_id ON organization_users(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_users_user_id ON organization_users(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_checklist_org_id ON onboarding_checklist_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_portal_access_org_id ON portal_access_config(organization_id);
CREATE INDEX IF NOT EXISTS idx_compliance_items_org_id ON compliance_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_compliance_items_status ON compliance_items(status);
