-- Fix Beta Tester badges for all current users
-- This ensures all existing users get the Beta Tester badge

-- Insert Beta Tester badge for all existing users who don't have it
INSERT INTO badge_progress (user_id, badge_id, earned, progress, earned_at)
SELECT 
    p.id as user_id,
    'beta_tester' as badge_id,
    true as earned,
    100 as progress,
    p.created_at as earned_at
FROM profiles p
WHERE NOT EXISTS (
    SELECT 1 FROM badge_progress bp 
    WHERE bp.user_id = p.id AND bp.badge_id = 'beta_tester'
);

-- Update existing Beta Tester badges to be earned
UPDATE badge_progress 
SET earned = true, progress = 100
WHERE badge_id = 'beta_tester' AND earned = false;

-- Count how many users now have the Beta Tester badge
SELECT COUNT(*) as beta_tester_count FROM badge_progress WHERE badge_id = 'beta_tester' AND earned = true; 