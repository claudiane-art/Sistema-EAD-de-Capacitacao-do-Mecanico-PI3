/*
  # Fix bonus points column name

  1. Changes
    - Rename bonus_points to bonusPoints to match the application's camelCase convention
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'bonus_points'
  ) THEN
    ALTER TABLE users RENAME COLUMN bonus_points TO "bonusPoints";
  END IF;
END $$;