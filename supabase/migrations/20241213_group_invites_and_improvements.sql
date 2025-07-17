-- Add unique constraint to group names
ALTER TABLE groups ADD CONSTRAINT groups_name_unique UNIQUE (name);

-- Create group_invites table
CREATE TABLE IF NOT EXISTS group_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  inviter_id uuid REFERENCES profiles(id),
  invitee_email text,
  invitee_username text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  expires_at timestamp DEFAULT (now() + interval '7 days'),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Add RLS policies for group_invites
ALTER TABLE group_invites ENABLE ROW LEVEL SECURITY;

-- Allow group hosts to create invites
CREATE POLICY "Hosts can create invites"
  ON group_invites FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM groups
      WHERE id = group_invites.group_id
      AND host_id = auth.uid()
    )
  );

-- Allow users to view invites sent to them
CREATE POLICY "Users can view their invites"
  ON group_invites FOR SELECT
  USING (
    invitee_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) OR
    invitee_username = (
      SELECT username FROM profiles WHERE id = auth.uid()
    )
  );

-- Allow users to update their invite status
CREATE POLICY "Users can update their invite status"
  ON group_invites FOR UPDATE
  USING (
    invitee_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) OR
    invitee_username = (
      SELECT username FROM profiles WHERE id = auth.uid()
    )
  );

-- Allow group hosts to view all invites for their groups
CREATE POLICY "Hosts can view group invites"
  ON group_invites FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM groups
      WHERE id = group_invites.group_id
      AND host_id = auth.uid()
    )
  );

-- Create function to handle invite acceptance
CREATE OR REPLACE FUNCTION public.accept_group_invite(invite_id uuid)
RETURNS void AS $$
DECLARE
  group_uuid uuid;
  user_uuid uuid;
BEGIN
  -- Get the group ID and user ID
  SELECT gi.group_id, p.id INTO group_uuid, user_uuid
  FROM group_invites gi
  LEFT JOIN profiles p ON (
    (gi.invitee_email = (SELECT email FROM auth.users WHERE id = p.id)) OR
    (gi.invitee_username = p.username)
  )
  WHERE gi.id = invite_id
  AND gi.status = 'pending'
  AND gi.expires_at > now();

  -- Check if invite is valid
  IF group_uuid IS NULL OR user_uuid IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired invite';
  END IF;

  -- Add user to group
  INSERT INTO group_members (group_id, user_id, role, status, joined_at)
  VALUES (group_uuid, user_uuid, 'member', 'approved', now())
  ON CONFLICT (group_id, user_id) DO NOTHING;

  -- Update invite status
  UPDATE group_invites
  SET status = 'accepted', updated_at = now()
  WHERE id = invite_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean up expired invites
CREATE OR REPLACE FUNCTION public.cleanup_expired_invites()
RETURNS void AS $$
BEGIN
  UPDATE group_invites
  SET status = 'expired', updated_at = now()
  WHERE status = 'pending' AND expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically clean up expired invites
CREATE OR REPLACE FUNCTION public.trigger_cleanup_expired_invites()
RETURNS trigger AS $$
BEGIN
  PERFORM cleanup_expired_invites();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger (runs on any group_invites operation)
CREATE TRIGGER cleanup_expired_invites_trigger
  AFTER INSERT OR UPDATE OR DELETE ON group_invites
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_cleanup_expired_invites();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_group_invites_email ON group_invites(invitee_email);
CREATE INDEX IF NOT EXISTS idx_group_invites_username ON group_invites(invitee_username);
CREATE INDEX IF NOT EXISTS idx_group_invites_status ON group_invites(status);
CREATE INDEX IF NOT EXISTS idx_group_invites_expires ON group_invites(expires_at); 