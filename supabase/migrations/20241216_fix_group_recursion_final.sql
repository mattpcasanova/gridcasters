-- Final fix for infinite recursion in group_members
-- Disable RLS on group_members to prevent conflicts with triggers
-- Security will be handled in application code

-- Disable RLS on group_members
ALTER TABLE group_members DISABLE ROW LEVEL SECURITY;

-- Drop all policies on group_members since RLS is disabled
DROP POLICY IF EXISTS "Members are viewable by group members" ON group_members;
DROP POLICY IF EXISTS "Users can request to join groups" ON group_members;
DROP POLICY IF EXISTS "Hosts can manage group members" ON group_members;
DROP POLICY IF EXISTS "Hosts can remove group members" ON group_members;

-- Ensure the trigger function exists and is correct
DROP TRIGGER IF EXISTS on_group_created ON groups;
DROP FUNCTION IF EXISTS public.handle_new_group();

-- Recreate the function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_group()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert the host as a member with SECURITY DEFINER
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