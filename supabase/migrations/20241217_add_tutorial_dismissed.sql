-- Add tutorial_dismissed column to profiles table
ALTER TABLE profiles 
ADD COLUMN tutorial_dismissed boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN profiles.tutorial_dismissed IS 'Whether the user has dismissed the rankings tutorial popup'; 