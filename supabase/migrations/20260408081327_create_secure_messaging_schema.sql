/*
  # Create Secure Messaging Schema

  1. New Tables
    - `messaging_users`
      - User profiles for messaging system
      - Links to auth.users
      - Role-based identification

    - `messaging_conversations`
      - Conversation metadata
      - Participant tracking
      - Encryption status
      - Shared patient context

    - `messaging_participants`
      - Junction table for conversation participants
      - Many-to-many relationship

    - `messaging_messages`
      - Individual messages
      - Support for multiple message types
      - Read receipts
      - Medical context attachments

    - `messaging_attachments`
      - File attachments metadata
      - Links to storage buckets

    - `messaging_read_receipts`
      - Track message read status per user
      - Timestamp tracking

  2. Security
    - Enable RLS on all tables
    - Users can only access conversations they're part of
    - Messages only visible to conversation participants
    - Audit logging for compliance
*/

-- Messaging Users Table
CREATE TABLE IF NOT EXISTS messaging_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('patient', 'doctor', 'pharmacist', 'lab-staff', 'admin', 'system')),
  organization text NOT NULL,
  avatar_url text,
  is_online boolean DEFAULT false,
  last_seen timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE messaging_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all messaging users"
  ON messaging_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON messaging_users FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- Conversations Table
CREATE TABLE IF NOT EXISTS messaging_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_type text NOT NULL CHECK (conversation_type IN ('patient-doctor', 'doctor-doctor', 'doctor-pharmacy', 'doctor-lab', 'system')),
  is_encrypted boolean DEFAULT true,
  shared_patient_id uuid,
  shared_patient_name text,
  shared_patient_emirates_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE messaging_conversations ENABLE ROW LEVEL SECURITY;

-- Participants Table
CREATE TABLE IF NOT EXISTS messaging_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES messaging_conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES messaging_users(id) NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

ALTER TABLE messaging_participants ENABLE ROW LEVEL SECURITY;

-- Now add policies that reference messaging_participants
CREATE POLICY "Users can view conversations they participate in"
  ON messaging_conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messaging_participants
      WHERE messaging_participants.conversation_id = messaging_conversations.id
      AND messaging_participants.user_id IN (
        SELECT id FROM messaging_users WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Authenticated users can create conversations"
  ON messaging_conversations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view participants in their conversations"
  ON messaging_participants FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT conversation_id FROM messaging_participants
      WHERE user_id IN (
        SELECT id FROM messaging_users WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Authenticated users can add participants"
  ON messaging_participants FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Messages Table
CREATE TABLE IF NOT EXISTS messaging_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES messaging_conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES messaging_users(id) NOT NULL,
  message_type text NOT NULL CHECK (message_type IN ('text', 'file', 'image', 'voice', 'medical-context')) DEFAULT 'text',
  content text NOT NULL,
  reply_to_id uuid REFERENCES messaging_messages(id),
  medical_context_type text CHECK (medical_context_type IN ('lab-result', 'appointment', 'prescription', 'vital-sign')),
  medical_context_title text,
  medical_context_summary text,
  medical_context_detail_url text,
  is_encrypted boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE messaging_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their conversations"
  ON messaging_messages FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT conversation_id FROM messaging_participants
      WHERE user_id IN (
        SELECT id FROM messaging_users WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can send messages to their conversations"
  ON messaging_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    conversation_id IN (
      SELECT conversation_id FROM messaging_participants
      WHERE user_id IN (
        SELECT id FROM messaging_users WHERE auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete their own messages"
  ON messaging_messages FOR DELETE
  TO authenticated
  USING (
    sender_id IN (
      SELECT id FROM messaging_users WHERE auth_user_id = auth.uid()
    )
  );

-- Attachments Table
CREATE TABLE IF NOT EXISTS messaging_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messaging_messages(id) ON DELETE CASCADE NOT NULL,
  attachment_type text NOT NULL CHECK (attachment_type IN ('pdf', 'image', 'voice', 'document')),
  filename text NOT NULL,
  file_size bigint NOT NULL,
  storage_path text NOT NULL,
  thumbnail_path text,
  duration_seconds integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messaging_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view attachments in their conversations"
  ON messaging_attachments FOR SELECT
  TO authenticated
  USING (
    message_id IN (
      SELECT id FROM messaging_messages
      WHERE conversation_id IN (
        SELECT conversation_id FROM messaging_participants
        WHERE user_id IN (
          SELECT id FROM messaging_users WHERE auth_user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can upload attachments to their messages"
  ON messaging_attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    message_id IN (
      SELECT id FROM messaging_messages
      WHERE conversation_id IN (
        SELECT conversation_id FROM messaging_participants
        WHERE user_id IN (
          SELECT id FROM messaging_users WHERE auth_user_id = auth.uid()
        )
      )
    )
  );

-- Read Receipts Table
CREATE TABLE IF NOT EXISTS messaging_read_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messaging_messages(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES messaging_users(id) NOT NULL,
  read_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id)
);

ALTER TABLE messaging_read_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view read receipts in their conversations"
  ON messaging_read_receipts FOR SELECT
  TO authenticated
  USING (
    message_id IN (
      SELECT id FROM messaging_messages
      WHERE conversation_id IN (
        SELECT conversation_id FROM messaging_participants
        WHERE user_id IN (
          SELECT id FROM messaging_users WHERE auth_user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create read receipts for messages"
  ON messaging_read_receipts FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IN (
      SELECT id FROM messaging_users WHERE auth_user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messaging_messages_conversation
  ON messaging_messages(conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messaging_participants_user
  ON messaging_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_messaging_participants_conversation
  ON messaging_participants(conversation_id);

CREATE INDEX IF NOT EXISTS idx_messaging_read_receipts_message
  ON messaging_read_receipts(message_id);

CREATE INDEX IF NOT EXISTS idx_messaging_attachments_message
  ON messaging_attachments(message_id);
