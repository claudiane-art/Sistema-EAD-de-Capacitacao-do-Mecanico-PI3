/*
  # Fix RLS policies and schema issues

  1. Changes
    - Add INSERT policy for authenticated users
    - Update existing policies to handle both id and auth.uid()
    - Ensure completion_percentage exists
    - Add policy for users to insert their own data
*/

-- First ensure the completion_percentage column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'completion_percentage'
  ) THEN
    ALTER TABLE users ADD COLUMN completion_percentage numeric DEFAULT 0;
  END IF;
END $$;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can read all user data" ON users;
DROP POLICY IF EXISTS "Admins can update all user data" ON users;

-- Create comprehensive policies
CREATE POLICY "Enable insert for authenticated users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR role = 'admin')
  WITH CHECK (auth.uid() = id OR role = 'admin');