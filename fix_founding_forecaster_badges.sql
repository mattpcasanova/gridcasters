-- Fix Founding Forecaster Badge for All Current Users
-- This SQL will award the founding forecaster badge to all existing users
-- and set up proper logic for future users

-- Step 1: Award founding forecaster badge to all existing users
INSERT INTO badge_progress (user_id, badge_id, earned, progress, earned_at, last_checked, notification_shown)
SELECT 
    p.id as user_id,
    'founding_forecaster' as badge_id,
    true as earned,
    100 as progress,
    p.created_at as earned_at,
    NOW() as last_checked,
    false as notification_shown
FROM profiles p
WHERE NOT EXISTS (
    SELECT 1 FROM badge_progress bp 
    WHERE bp.user_id = p.id AND bp.badge_id = 'founding_forecaster'
);

-- Step 2: Update the trigger function to properly check user order
CREATE OR REPLACE FUNCTION award_founding_forecaster_badge()
RETURNS TRIGGER AS $$
DECLARE
    user_rank INTEGER;
BEGIN
    -- Get the user's rank based on creation date (earliest = rank 1)
    SELECT COUNT(*) + 1 INTO user_rank
    FROM profiles 
    WHERE created_at < NEW.created_at;
    
    -- Award founding forecaster badge if user is among first 250
    IF user_rank <= 250 THEN
        INSERT INTO badge_progress (user_id, badge_id, earned, progress, earned_at, last_checked, notification_shown)
        VALUES (NEW.id, 'founding_forecaster', true, 100, NEW.created_at, NOW(), false)
        ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create trigger for new users
DROP TRIGGER IF EXISTS trigger_award_founding_forecaster ON profiles;
CREATE TRIGGER trigger_award_founding_forecaster
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION award_founding_forecaster_badge();

-- Step 4: Show summary of changes
SELECT 
    'Founding Forecaster Badges Awarded' as action,
    COUNT(*) as count
FROM badge_progress 
WHERE badge_id = 'founding_forecaster';

-- Step 5: Show current user count and founding member status
SELECT 
    'Current Stats' as info,
    COUNT(*) as total_users,
    COUNT(CASE WHEN bp.badge_id = 'founding_forecaster' THEN 1 END) as founding_members
FROM profiles p
LEFT JOIN badge_progress bp ON p.id = bp.user_id AND bp.badge_id = 'founding_forecaster'; 