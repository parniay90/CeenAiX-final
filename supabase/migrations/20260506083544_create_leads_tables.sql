/*
  # Create leads capture tables for CeenAiX public landing page

  ## Summary
  This migration creates two tables to capture pre-launch leads from the public landing page:
  - `demo_requests`: Stores personalized demo request form submissions
  - `launch_notifications`: Stores launch announcement email signups

  ## New Tables

  ### demo_requests
  - `id` (uuid, PK) — auto-generated
  - `full_name` (text) — submitter's full name
  - `email` (text) — work email
  - `phone` (text) — phone with country code
  - `organization_name` (text) — company/clinic name
  - `role` (text) — submitter's role (Owner, Founder, etc.)
  - `organization_type` (text) — Hospital, Clinic, Pharmacy, etc.
  - `country` (text) — country or UAE emirate
  - `team_size` (text) — size bucket
  - `interests` (text[]) — multi-select interest chips
  - `preferred_demo_time` (text) — time preference
  - `specific_date` (date, nullable) — specific requested date
  - `notes` (text) — free-form notes
  - `preferred_language` (text) — en or ar
  - `marketing_opt_in` (boolean) — opted into updates
  - `status` (text) — new, contacted, scheduled, completed, cancelled
  - `created_at` (timestamptz) — submission timestamp
  - `ip_hint` (text) — geolocation hint (no PII)
  - `source_hash` (text) — dedup hash (email+org)

  ### launch_notifications
  - `id` (uuid, PK)
  - `name` (text)
  - `email` (text, unique) — deduplicated by email
  - `country` (text, nullable)
  - `persona` (text, nullable) — "Healthcare professional", etc.
  - `preferred_language` (text) — en or ar
  - `created_at` (timestamptz)
  - `source_hash` (text) — dedup hash

  ## Security
  - RLS enabled on both tables
  - No direct client access — all writes go through Edge Functions using service role key
  - Service-role-only INSERT via edge function (no RLS policy needed for anon INSERT;
    the edge function uses the service role key which bypasses RLS)
  - Admin SELECT policy restricted to authenticated admin users
*/

-- demo_requests table
CREATE TABLE IF NOT EXISTS demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  organization_name text NOT NULL,
  role text NOT NULL,
  organization_type text NOT NULL,
  country text NOT NULL,
  team_size text NOT NULL,
  interests text[] NOT NULL DEFAULT '{}',
  preferred_demo_time text NOT NULL DEFAULT 'Anytime',
  specific_date date,
  notes text DEFAULT '',
  preferred_language text NOT NULL DEFAULT 'en',
  marketing_opt_in boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new',
  source_hash text NOT NULL DEFAULT '',
  ip_hint text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can read demo requests
CREATE POLICY "Authenticated admins can view demo requests"
  ON demo_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'super_admin')
    )
  );

-- launch_notifications table
CREATE TABLE IF NOT EXISTS launch_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  country text DEFAULT '',
  persona text DEFAULT '',
  preferred_language text NOT NULL DEFAULT 'en',
  source_hash text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE launch_notifications ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can read notification signups
CREATE POLICY "Authenticated admins can view launch notifications"
  ON launch_notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'super_admin')
    )
  );

-- Index for fast dedup lookups
CREATE INDEX IF NOT EXISTS demo_requests_email_idx ON demo_requests (email);
CREATE INDEX IF NOT EXISTS demo_requests_status_idx ON demo_requests (status);
CREATE INDEX IF NOT EXISTS launch_notifications_email_idx ON launch_notifications (email);
CREATE INDEX IF NOT EXISTS demo_requests_created_at_idx ON demo_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS launch_notifications_created_at_idx ON launch_notifications (created_at DESC);
