-- Initialize beta tester and founding forecaster badges for existing users
-- This migration will award these badges to users who joined during the beta period

-- Function to initialize badges for existing users
CREATE OR REPLACE FUNCTION initialize_beta_badges()
RETURNS void AS $$
DECLARE
    user_record RECORD;
    beta_end_date TIMESTAMP := '2025-01-01 00:00:00';
    user_count INTEGER := 0;
BEGIN
    -- Loop through all existing users
    FOR user_record IN 
        SELECT id, created_at 
        FROM profiles 
        ORDER BY created_at ASC
    LOOP
        user_count := user_count + 1;
        
        -- Determine if user is a beta tester (joined before beta end date)
        IF user_record.created_at < beta_end_date THEN
            -- Insert beta tester badge
            INSERT INTO badge_progress (user_id, badge_id, earned, progress, earned_at)
            VALUES (user_record.id, 'beta_tester', true, 100, user_record.created_at)
            ON CONFLICT (user_id, badge_id) DO NOTHING;
        END IF;
        
        -- Determine if user is a founding member (first 250 users)
        IF user_count <= 250 THEN
            -- Insert founding forecaster badge
            INSERT INTO badge_progress (user_id, badge_id, earned, progress, earned_at)
            VALUES (user_record.id, 'founding_forecaster', true, 100, user_record.created_at)
            ON CONFLICT (user_id, badge_id) DO NOTHING;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Initialized badges for % users', user_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to initialize badges for existing users
SELECT initialize_beta_badges();

-- Drop the function after use
DROP FUNCTION initialize_beta_badges();

-- Create a trigger to automatically award beta tester badge to new users
CREATE OR REPLACE FUNCTION award_beta_badge_on_signup()
RETURNS TRIGGER AS $$
DECLARE
    beta_end_date TIMESTAMP := '2025-01-01 00:00:00';
    user_count INTEGER;
BEGIN
    -- Check if user joined during beta period
    IF NEW.created_at < beta_end_date THEN
        -- Award beta tester badge
        INSERT INTO badge_progress (user_id, badge_id, earned, progress, earned_at)
        VALUES (NEW.id, 'beta_tester', true, 100, NEW.created_at)
        ON CONFLICT (user_id, badge_id) DO NOTHING;
        
        -- Check if user is among first 250
        SELECT COUNT(*) INTO user_count FROM profiles;
        IF user_count <= 250 THEN
            -- Award founding forecaster badge
            INSERT INTO badge_progress (user_id, badge_id, earned, progress, earned_at)
            VALUES (NEW.id, 'founding_forecaster', true, 100, NEW.created_at)
            ON CONFLICT (user_id, badge_id) DO NOTHING;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically award badges on new user signup
DROP TRIGGER IF EXISTS trigger_award_beta_badge ON profiles;
CREATE TRIGGER trigger_award_beta_badge
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION award_beta_badge_on_signup(); 