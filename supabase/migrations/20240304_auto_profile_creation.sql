-- Approach 1: Automatic profile creation via database trigger

-- Function to automatically create profile when user is created
CREATE OR REPLACE FUNCTION auto_create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile automatically when user is inserted into auth.users
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    is_private,
    is_verified,
    email_confirmed,
    created_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    false,
    false,
    false, -- Always start as false, will be updated by email confirmation
    now()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, ignore
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users INSERT
DROP TRIGGER IF EXISTS trigger_auto_create_profile ON auth.users;
CREATE TRIGGER trigger_auto_create_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_user_profile();

-- Update the email confirmation trigger to be more robust
CREATE OR REPLACE FUNCTION update_profile_email_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  -- Update email_confirmed when email_confirmed_at changes from null to timestamp
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    UPDATE public.profiles 
    SET email_confirmed = true 
    WHERE id = NEW.id;
    
    -- Log successful update
    RAISE NOTICE 'Profile email_confirmed updated for user %', NEW.id;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth update
    RAISE WARNING 'Failed to update profile email_confirmed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 