-- Step 1: Add email_confirmed column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_confirmed boolean DEFAULT false;

-- Update existing profiles to mark them as confirmed if they exist
UPDATE public.profiles 
SET email_confirmed = true 
WHERE email_confirmed IS NULL OR email_confirmed = false;

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_email_confirmed 
ON public.profiles(email_confirmed);

-- Step 2: Create a function to handle profile creation during signup
CREATE OR REPLACE FUNCTION create_profile_on_signup(
  user_id uuid,
  username text,
  display_name text DEFAULT NULL,
  email_confirmed boolean DEFAULT false
)
RETURNS void AS $$
BEGIN
  -- Check if the auth user exists first
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_id) THEN
    RAISE EXCEPTION 'User with ID % does not exist in auth.users', user_id;
  END IF;
  
  -- Insert the profile with SECURITY DEFINER to bypass RLS
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    is_private,
    is_verified,
    email_confirmed,
    created_at
  ) VALUES (
    user_id,
    username,
    COALESCE(display_name, username),
    false,
    false,
    email_confirmed,
    now()
  );
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, just update the email_confirmed status if needed
    UPDATE public.profiles 
    SET email_confirmed = create_profile_on_signup.email_confirmed
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION create_profile_on_signup(uuid, text, text, boolean) TO authenticated, anon;

-- Step 3: Create function to update profile email_confirmed status
CREATE OR REPLACE FUNCTION update_profile_email_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if email_confirmed_at changed from null to a timestamp
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    UPDATE public.profiles 
    SET email_confirmed = true 
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS trigger_update_profile_email_confirmed ON auth.users;
CREATE TRIGGER trigger_update_profile_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_email_confirmed(); 