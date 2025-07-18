-- Update the profile creation function to handle additional fields
CREATE OR REPLACE FUNCTION create_profile_on_signup(
  user_id uuid,
  username text,
  display_name text DEFAULT NULL,
  email_confirmed boolean DEFAULT false,
  first_name text DEFAULT NULL,
  last_name text DEFAULT NULL,
  birth_date date DEFAULT NULL
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
    birth_date,
    created_at
  ) VALUES (
    user_id,
    username,
    COALESCE(display_name, username),
    false,
    false,
    email_confirmed,
    birth_date,
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
GRANT EXECUTE ON FUNCTION create_profile_on_signup(uuid, text, text, boolean, text, text, date) TO authenticated, anon; 