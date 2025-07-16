-- Add field to track which badges have been shown in notifications
ALTER TABLE badge_progress 
ADD COLUMN notification_shown BOOLEAN DEFAULT FALSE;

-- Update existing badge progress records to mark notifications as shown
-- (so existing users don't get spammed with notifications for badges they already earned)
UPDATE badge_progress 
SET notification_shown = TRUE 
WHERE earned = TRUE; 