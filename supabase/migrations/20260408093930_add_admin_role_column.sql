/*
  # Add Admin Role Column to User Roles Table

  1. Changes
    - Add `admin_role` column to `user_roles` table
    - Support 4 admin role types: super_admin, pharmacy_admin, lab_admin, imaging_admin
    - Column is nullable and only applies when role = 'admin'
  
  2. Admin Role Types
    - super_admin: Full platform access and control
    - pharmacy_admin: Pharmacy management access
    - lab_admin: Laboratory management access
    - imaging_admin: MRI & Imaging management access
*/

-- Add admin_role column to user_roles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_roles' AND column_name = 'admin_role'
  ) THEN
    ALTER TABLE user_roles 
    ADD COLUMN admin_role text CHECK (admin_role IN ('super_admin', 'pharmacy_admin', 'lab_admin', 'imaging_admin'));
  END IF;
END $$;