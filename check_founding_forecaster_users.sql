-- Check all users with founding forecaster badge
-- This query shows all users who have earned the founding forecaster badge

SELECT 
    p.id,
    p.username,
    p.display_name,
    p.created_at,
    bp.earned_at,
    bp.progress,
    bp.last_checked,
    bp.notification_shown
FROM profiles p
INNER JOIN badge_progress bp ON p.id = bp.user_id
WHERE bp.badge_id = 'founding_forecaster' 
  AND bp.earned = true
ORDER BY p.created_at ASC;

-- Summary count
SELECT 
    'Founding Forecaster Badge Holders' as info,
    COUNT(*) as total_users
FROM profiles p
INNER JOIN badge_progress bp ON p.id = bp.user_id
WHERE bp.badge_id = 'founding_forecaster' 
  AND bp.earned = true;

-- Check if any users are missing the badge (should be none after running the fix)
SELECT 
    'Users Missing Founding Forecaster Badge' as info,
    COUNT(*) as missing_count
FROM profiles p
WHERE NOT EXISTS (
    SELECT 1 FROM badge_progress bp 
    WHERE bp.user_id = p.id 
      AND bp.badge_id = 'founding_forecaster' 
      AND bp.earned = true
);

-- Show first 250 users by join date and their badge status
SELECT 
    ROW_NUMBER() OVER (ORDER BY p.created_at ASC) as join_rank,
    p.username,
    p.display_name,
    p.created_at,
    CASE 
        WHEN bp.earned = true THEN '✅ Has Badge'
        ELSE '❌ Missing Badge'
    END as badge_status
FROM profiles p
LEFT JOIN badge_progress bp ON p.id = bp.user_id AND bp.badge_id = 'founding_forecaster'
ORDER BY p.created_at ASC
LIMIT 250; 