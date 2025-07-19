-- Add notification_shown column to badge_progress table
ALTER TABLE badge_progress 
ADD COLUMN IF NOT EXISTS notification_shown boolean DEFAULT false;

-- Update existing earned badges to have notification_shown = true
UPDATE badge_progress 
SET notification_shown = true 
WHERE earned = true;

-- Create index for faster queries on notification_shown
CREATE INDEX IF NOT EXISTS idx_badge_progress_notification_shown 
ON badge_progress(notification_shown);

-- Update the upsert function to handle notification_shown
CREATE OR REPLACE FUNCTION upsert_badge_progress(
  user_uuid uuid,
  badge_id_param text,
  earned_param boolean,
  progress_param integer,
  notification_shown_param boolean DEFAULT false
)
RETURNS void AS $$
BEGIN
  INSERT INTO badge_progress (user_id, badge_id, earned, progress, earned_at, notification_shown)
  VALUES (
    user_uuid,
    badge_id_param,
    earned_param,
    progress_param,
    CASE WHEN earned_param AND NOT EXISTS (
      SELECT 1 FROM badge_progress 
      WHERE user_id = user_uuid AND badge_id = badge_id_param AND earned = true
    ) THEN now() ELSE NULL END,
    notification_shown_param
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
    notification_shown = EXCLUDED.notification_shown,
    last_checked = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 