-- Create badge_progress table to track user badge earning
CREATE TABLE IF NOT EXISTS badge_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id text NOT NULL,
  earned boolean DEFAULT false,
  progress integer DEFAULT 0,
  earned_at timestamp,
  last_checked timestamp DEFAULT now(),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_badge_progress_user_id ON badge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_badge_progress_badge_id ON badge_progress(badge_id);
CREATE INDEX IF NOT EXISTS idx_badge_progress_earned ON badge_progress(earned);

-- Enable RLS
ALTER TABLE badge_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own badge progress" ON badge_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own badge progress" ON badge_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert badge progress" ON badge_progress
  FOR INSERT WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_badge_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER badge_progress_updated_at
  BEFORE UPDATE ON badge_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_badge_progress_updated_at();

-- Function to get user badge progress
CREATE OR REPLACE FUNCTION get_user_badge_progress(user_uuid uuid)
RETURNS TABLE (
  badge_id text,
  earned boolean,
  progress integer,
  earned_at timestamp,
  last_checked timestamp
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.badge_id,
    bp.earned,
    bp.progress,
    bp.earned_at,
    bp.last_checked
  FROM badge_progress bp
  WHERE bp.user_id = user_uuid
  ORDER BY bp.badge_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to upsert badge progress
CREATE OR REPLACE FUNCTION upsert_badge_progress(
  user_uuid uuid,
  badge_id_param text,
  earned_param boolean,
  progress_param integer
)
RETURNS void AS $$
BEGIN
  INSERT INTO badge_progress (user_id, badge_id, earned, progress, earned_at)
  VALUES (
    user_uuid,
    badge_id_param,
    earned_param,
    progress_param,
    CASE WHEN earned_param AND NOT EXISTS (
      SELECT 1 FROM badge_progress 
      WHERE user_id = user_uuid AND badge_id = badge_id_param AND earned = true
    ) THEN now() ELSE NULL END
  )
  ON CONFLICT (user_id, badge_id)
  DO UPDATE SET
    earned = EXCLUDED.earned,
    progress = EXCLUDED.progress,
    earned_at = CASE 
      WHEN EXCLUDED.earned AND badge_progress.earned = false 
      THEN now() 
      ELSE badge_progress.earned_at 
    END,
    last_checked = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 