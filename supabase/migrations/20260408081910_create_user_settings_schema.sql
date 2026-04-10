/*
  # Create User Settings Schema

  1. New Tables
    - `user_profiles`
      - Extended user profile information
      - Links to auth.users
      - Emergency contact details

    - `family_members`
      - Linked family accounts (minors, elderly parents)
      - Guardianship relationships
      - Emirates ID verification

    - `privacy_settings`
      - NABIDH consent
      - AI health assistant preferences
      - Research participation
      - Insurance data sharing

    - `notification_settings`
      - Per-category notification preferences
      - Multi-channel delivery (push, SMS, email, WhatsApp)
      - Quiet hours configuration

    - `language_settings`
      - Language and accessibility preferences
      - Font size, high contrast, RTL layout

    - `security_settings`
      - Two-factor authentication
      - Active sessions tracking
      - Login history

    - `user_feedback`
      - User feedback submissions
      - Bug reports
      - Support tickets

  2. Security
    - Enable RLS on all tables
    - Users can only access their own settings
    - Family members visible to guardians
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) UNIQUE NOT NULL,
  display_name text NOT NULL,
  phone text,
  date_of_birth date,
  emirates_id text UNIQUE,
  profile_photo_url text,
  emergency_contact_name text,
  emergency_contact_relationship text,
  emergency_contact_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = auth_user_id);

-- Family Members Table
CREATE TABLE IF NOT EXISTS family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id uuid REFERENCES user_profiles(id) NOT NULL,
  name text NOT NULL,
  relationship text NOT NULL CHECK (relationship IN ('child', 'parent', 'spouse')),
  emirates_id text NOT NULL,
  date_of_birth date NOT NULL,
  linked_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own family members"
  ON family_members FOR SELECT
  TO authenticated
  USING (
    guardian_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own family members"
  ON family_members FOR ALL
  TO authenticated
  USING (
    guardian_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    guardian_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  );

-- Privacy Settings Table
CREATE TABLE IF NOT EXISTS privacy_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) UNIQUE NOT NULL,
  nabidh_consent boolean DEFAULT false,
  ai_health_assistant boolean DEFAULT true,
  research_participation boolean DEFAULT false,
  insurance_data_sharing jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE privacy_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own privacy settings"
  ON privacy_settings FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own privacy settings"
  ON privacy_settings FOR ALL
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  );

-- Notification Settings Table
CREATE TABLE IF NOT EXISTS notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) UNIQUE NOT NULL,
  categories jsonb DEFAULT '{}',
  quiet_hours_enabled boolean DEFAULT false,
  quiet_hours_start time,
  quiet_hours_end time,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification settings"
  ON notification_settings FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own notification settings"
  ON notification_settings FOR ALL
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  );

-- Language Settings Table
CREATE TABLE IF NOT EXISTS language_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) UNIQUE NOT NULL,
  language text DEFAULT 'en' CHECK (language IN ('en', 'ar')),
  font_size text DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large', 'xl')),
  high_contrast boolean DEFAULT false,
  screen_reader_optimized boolean DEFAULT false,
  rtl_layout boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE language_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own language settings"
  ON language_settings FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own language settings"
  ON language_settings FOR ALL
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  );

-- Active Sessions Table
CREATE TABLE IF NOT EXISTS active_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) NOT NULL,
  device_name text NOT NULL,
  device_type text NOT NULL CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  location text,
  ip_address text,
  last_active timestamptz DEFAULT now(),
  is_current boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON active_sessions FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own sessions"
  ON active_sessions FOR DELETE
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  );

-- Login History Table
CREATE TABLE IF NOT EXISTS login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) NOT NULL,
  device_name text NOT NULL,
  location text,
  ip_address text,
  success boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own login history"
  ON login_history FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  );

-- Two Factor Auth Table
CREATE TABLE IF NOT EXISTS two_factor_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) UNIQUE NOT NULL,
  enabled boolean DEFAULT false,
  method text CHECK (method IN ('sms', 'authenticator')),
  phone_number text,
  secret_key text,
  backup_codes text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE two_factor_auth ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own 2FA settings"
  ON two_factor_auth FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own 2FA settings"
  ON two_factor_auth FOR ALL
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  );

-- User Feedback Table
CREATE TABLE IF NOT EXISTS user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id),
  feedback_type text NOT NULL CHECK (feedback_type IN ('rating', 'bug', 'support', 'feature')),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  subject text,
  message text NOT NULL,
  screenshot_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'resolved', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feedback"
  ON user_feedback FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can submit feedback"
  ON user_feedback FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IN (
      SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_family_members_guardian
  ON family_members(guardian_id);

CREATE INDEX IF NOT EXISTS idx_active_sessions_user
  ON active_sessions(user_id, last_active DESC);

CREATE INDEX IF NOT EXISTS idx_login_history_user
  ON login_history(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_feedback_user
  ON user_feedback(user_id, created_at DESC);
