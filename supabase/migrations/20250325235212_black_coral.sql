/*
  # Initial Schema Setup

  1. Tables
    - users
      - id (uuid, primary key)
      - name (text)
      - cpf (text, unique)
      - role (text)
      - status (text)
      - progress (jsonb)
      - completion_percentage (numeric)
      - bonus_points (integer)
      - created_at (timestamp)

  2. Security
    - Enable RLS on users table
    - Add policies for user access
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cpf text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'student',
  status text NOT NULL DEFAULT 'pending',
  progress jsonb DEFAULT '[]'::jsonb,
  completion_percentage numeric DEFAULT 0,
  bonus_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Allow admins to read all user data
CREATE POLICY "Admins can read all user data"
  ON users
  FOR SELECT
  TO authenticated
  USING (role = 'admin');

-- Allow admins to update all user data
CREATE POLICY "Admins can update all user data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (role = 'admin');