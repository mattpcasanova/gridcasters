-- Approach 1: Automatic profile creation via database trigger

-- Create trigger on auth.users INSERT (function already defined in previous migration)
DROP TRIGGER IF EXISTS trigger_auto_create_profile ON auth.users;
CREATE TRIGGER trigger_auto_create_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_user_profile(); 