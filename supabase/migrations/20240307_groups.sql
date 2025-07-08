-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  avatar_url text,
  is_private boolean DEFAULT false,
  host_id uuid REFERENCES profiles(id) NOT NULL,
  avg_accuracy decimal(5,2) DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  role text DEFAULT 'member' CHECK (role IN ('member', 'admin', 'host')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  joined_at timestamp,
  created_at timestamp DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Add RLS policies
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public groups are viewable by everyone" ON groups;
DROP POLICY IF EXISTS "Users can create groups" ON groups;
DROP POLICY IF EXISTS "Hosts can update their groups" ON groups;
DROP POLICY IF EXISTS "Hosts can delete their groups" ON groups;
DROP POLICY IF EXISTS "Members are viewable by group members" ON group_members;
DROP POLICY IF EXISTS "Users can request to join groups" ON group_members;
DROP POLICY IF EXISTS "Hosts can manage group members" ON group_members;
DROP POLICY IF EXISTS "Hosts can remove group members" ON group_members;

-- Groups policies
CREATE POLICY "Public groups are viewable by everyone"
  ON groups FOR SELECT
  USING (NOT is_private OR host_id = auth.uid() OR EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_id = groups.id 
    AND user_id = auth.uid() 
    AND status = 'approved'
  ));

CREATE POLICY "Users can create groups"
  ON groups FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their groups"
  ON groups FOR UPDATE
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their groups"
  ON groups FOR DELETE
  USING (auth.uid() = host_id);

-- Group members policies
CREATE POLICY "Members are viewable by group members"
  ON group_members FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM groups g
    WHERE g.id = group_members.group_id
    AND (NOT g.is_private OR g.host_id = auth.uid() OR EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = g.id
      AND gm.user_id = auth.uid()
      AND gm.status = 'approved'
    ))
  ));

CREATE POLICY "Users can request to join groups"
  ON group_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    NOT EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = group_members.group_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can manage group members"
  ON group_members FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM groups
    WHERE id = group_members.group_id
    AND host_id = auth.uid()
  ));

CREATE POLICY "Hosts can remove group members"
  ON group_members FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM groups
    WHERE id = group_members.group_id
    AND host_id = auth.uid()
  ) OR auth.uid() = user_id); -- Users can remove themselves

-- Create function to automatically add host as member when group is created
CREATE OR REPLACE FUNCTION public.handle_new_group()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO group_members (group_id, user_id, role, status, joined_at)
  VALUES (NEW.id, NEW.host_id, 'host', 'approved', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to add host as member
DROP TRIGGER IF EXISTS on_group_created ON groups;
CREATE TRIGGER on_group_created
  AFTER INSERT ON groups
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_group(); 