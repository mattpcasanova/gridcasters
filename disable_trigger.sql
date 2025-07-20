-- Disable the trigger temporarily to test if it's causing ranking reversion

-- Drop the trigger
DROP TRIGGER IF EXISTS trigger_recalculate_averages ON player_rankings;

-- Verify the trigger is gone
SELECT 'Trigger status after dropping:' as info;
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_recalculate_averages';

-- Check if there are any other triggers on player_rankings
SELECT 'All triggers on player_rankings:' as info;
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'player_rankings'; 