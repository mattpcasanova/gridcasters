-- Add birth_date column to profiles table
ALTER TABLE profiles
ADD COLUMN birth_date date;

-- Add comment for documentation
COMMENT ON COLUMN profiles.birth_date IS 'User birth date for age verification and compliance'; 