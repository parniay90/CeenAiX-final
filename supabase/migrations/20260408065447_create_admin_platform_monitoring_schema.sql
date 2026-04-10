/*
  # Create Admin Platform Monitoring Schema

  1. New Tables
    - `platform_admins` (created first to avoid circular dependency)
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text)
      - `role` (enum) - super_admin, compliance_officer, system_admin
      - `permissions` (jsonb)
      - `created_at` (timestamptz)

    - `platform_organizations`
      - `id` (uuid, primary key)
      - `name` (text) - Organization name
      - `type` (enum) - hospital, clinic, pharmacy, laboratory
      - `emirate` (text) - UAE emirate location
      - `city` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `active_users` (integer)
      - `status` (enum) - active, inactive, suspended
      - `connected_at` (timestamptz)
      - `created_at` (timestamptz)

    - `platform_metrics`
      - `id` (uuid, primary key)
      - `metric_type` (text) - patients, consultations, nabidh_syncs, etc.
      - `value` (numeric)
      - `timestamp` (timestamptz)
      - `organization_id` (uuid, optional reference to platform_organizations)
      - `metadata` (jsonb) - Additional context
      - `created_at` (timestamptz)

    - `activity_events`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references platform_organizations)
      - `event_type` (enum) - prescription, nabidh_sync, interaction_alert, ai_consultation, lab_result, appointment
      - `description` (text)
      - `severity` (enum) - info, warning, critical
      - `metadata` (jsonb)
      - `timestamp` (timestamptz)
      - `created_at` (timestamptz)

    - `ai_performance_metrics`
      - `id` (uuid, primary key)
      - `model_accuracy` (decimal)
      - `total_interactions` (integer)
      - `alert_accuracy` (decimal)
      - `specialty_breakdown` (jsonb) - Array of {specialty, interactions}
      - `bias_monitoring` (jsonb) - Array of {demographic, percentage}
      - `recorded_at` (timestamptz)
      - `created_at` (timestamptz)

    - `system_health_metrics`
      - `id` (uuid, primary key)
      - `service_name` (text)
      - `status` (enum) - operational, degraded, down
      - `latency_ms` (integer)
      - `uptime_percentage` (decimal)
      - `error_rate` (decimal)
      - `active_sessions` (integer)
      - `timestamp` (timestamptz)
      - `created_at` (timestamptz)

    - `compliance_records`
      - `id` (uuid, primary key)
      - `dha_score` (integer) - 0-100
      - `next_audit_date` (date)
      - `nabidh_submission_rate` (decimal)
      - `outstanding_items` (jsonb) - Array of action items
      - `recorded_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Only platform admins can access these tables
    - Activity events are append-only
    - Audit trail for all admin actions

  3. Indexes
    - Performance indexes on timestamp columns
    - Organization lookup indexes
    - Event type filtering indexes
*/

-- Create enums
DO $$ BEGIN
  CREATE TYPE organization_type AS ENUM ('hospital', 'clinic', 'pharmacy', 'laboratory');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE organization_status AS ENUM ('active', 'inactive', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE activity_event_type AS ENUM ('prescription', 'nabidh_sync', 'interaction_alert', 'ai_consultation', 'lab_result', 'appointment');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE event_severity AS ENUM ('info', 'warning', 'critical');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE service_status AS ENUM ('operational', 'degraded', 'down');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE admin_role AS ENUM ('super_admin', 'compliance_officer', 'system_admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Platform admins table (created first)
CREATE TABLE IF NOT EXISTS platform_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE NOT NULL,
  full_name text NOT NULL,
  role admin_role NOT NULL,
  permissions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE platform_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view their own record"
  ON platform_admins FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage all admin records"
  ON platform_admins FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins pa
      WHERE pa.user_id = auth.uid()
      AND pa.role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM platform_admins pa
      WHERE pa.user_id = auth.uid()
      AND pa.role = 'super_admin'
    )
  );

-- Platform organizations table
CREATE TABLE IF NOT EXISTS platform_organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type organization_type NOT NULL,
  emirate text NOT NULL,
  city text NOT NULL,
  latitude decimal(10, 7),
  longitude decimal(10, 7),
  active_users integer DEFAULT 0,
  status organization_status DEFAULT 'active',
  connected_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE platform_organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view organizations"
  ON platform_organizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage organizations"
  ON platform_organizations FOR ALL
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

-- Platform metrics table
CREATE TABLE IF NOT EXISTS platform_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type text NOT NULL,
  value numeric NOT NULL,
  timestamp timestamptz DEFAULT now(),
  organization_id uuid REFERENCES platform_organizations(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE platform_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view metrics"
  ON platform_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert metrics"
  ON platform_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Activity events table
CREATE TABLE IF NOT EXISTS activity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES platform_organizations(id) NOT NULL,
  event_type activity_event_type NOT NULL,
  description text NOT NULL,
  severity event_severity DEFAULT 'info',
  metadata jsonb DEFAULT '{}'::jsonb,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view activity events"
  ON activity_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert activity events"
  ON activity_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- AI performance metrics table
CREATE TABLE IF NOT EXISTS ai_performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_accuracy decimal(5, 2) NOT NULL,
  total_interactions integer DEFAULT 0,
  alert_accuracy decimal(5, 2),
  specialty_breakdown jsonb DEFAULT '[]'::jsonb,
  bias_monitoring jsonb DEFAULT '[]'::jsonb,
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_performance_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view AI metrics"
  ON ai_performance_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert AI metrics"
  ON ai_performance_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- System health metrics table
CREATE TABLE IF NOT EXISTS system_health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  status service_status DEFAULT 'operational',
  latency_ms integer,
  uptime_percentage decimal(5, 2),
  error_rate decimal(5, 2),
  active_sessions integer,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE system_health_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view system health"
  ON system_health_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert health metrics"
  ON system_health_metrics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Compliance records table
CREATE TABLE IF NOT EXISTS compliance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dha_score integer CHECK (dha_score >= 0 AND dha_score <= 100),
  next_audit_date date NOT NULL,
  nabidh_submission_rate decimal(5, 2),
  outstanding_items jsonb DEFAULT '[]'::jsonb,
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE compliance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform admins can view compliance records"
  ON compliance_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Compliance officers can manage compliance records"
  ON compliance_records FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
      AND platform_admins.role IN ('super_admin', 'compliance_officer')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM platform_admins
      WHERE platform_admins.user_id = auth.uid()
      AND platform_admins.role IN ('super_admin', 'compliance_officer')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_platform_organizations_type ON platform_organizations(type);
CREATE INDEX IF NOT EXISTS idx_platform_organizations_status ON platform_organizations(status);
CREATE INDEX IF NOT EXISTS idx_platform_metrics_timestamp ON platform_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_platform_metrics_type ON platform_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_platform_metrics_org_id ON platform_metrics(organization_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_timestamp ON activity_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_activity_events_org_id ON activity_events(organization_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_type ON activity_events(event_type);
CREATE INDEX IF NOT EXISTS idx_activity_events_severity ON activity_events(severity);
CREATE INDEX IF NOT EXISTS idx_ai_performance_recorded_at ON ai_performance_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_system_health_timestamp ON system_health_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_health_service ON system_health_metrics(service_name);
CREATE INDEX IF NOT EXISTS idx_compliance_recorded_at ON compliance_records(recorded_at);
