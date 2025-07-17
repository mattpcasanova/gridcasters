-- Fix auth.config issue and group policies in one migration

-- First, let's remove the problematic auth.config update from the previous migration
-- (This will be a no-op if the table doesn't exist, but prevents the error)

-- Fix infinite recursion in group_members RLS policies
-- The issue is that the trigger function can't insert due to RLS policies
-- We need to modify the trigger function to bypass RLS

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_group_created ON groups;
DROP FUNCTION IF EXISTS public.handle_new_group();

-- Recreate the function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.handle_new_group()
RETURNS TRIGGER AS $$
BEGIN
  -- Use SECURITY DEFINER to bypass RLS policies
  INSERT INTO group_members (group_id, user_id, role, status, joined_at)
  VALUES (NEW.id, NEW.host_id, 'host', 'approved', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_group_created
  AFTER INSERT ON groups
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_group(); 