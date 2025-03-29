/*
  # Fix completion_percentage column type

  1. Changes
    - Ensure completion_percentage column exists with correct type
    - Add default value of 0
*/

DO $$
BEGIN
  -- Check if the column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'completion_percentage'
  ) THEN
    -- Add the column if it doesn't exist
    ALTER TABLE users ADD COLUMN completion_percentage numeric DEFAULT 0;
  END IF;
END $$;