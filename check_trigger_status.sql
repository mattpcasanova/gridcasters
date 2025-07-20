-- Check if the trigger is still active and causing issues

-- 1. Check if the trigger exists
SELECT 'Trigger status:' as info;
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_recalculate_averages';

-- 2. Check recent changes to player_average_rankings
SELECT 'Recent changes to player_average_rankings:' as info;
SELECT 
  position,
  player_name,
  average_rank,
  last_updated,
  COUNT(*) as count
FROM player_average_rankings
WHERE last_updated > NOW() - INTERVAL '1 hour'
GROUP BY position, player_name, average_rank, last_updated
ORDER BY last_updated DESC
LIMIT 20;

-- 3. Check recent OVR rankings
SELECT 'Recent OVR rankings:' as info;
SELECT 
  r.id,
  r.position,
  r.type,
  r.season,
  r.week,
  r.created_at,
  r.updated_at,
  COUNT(pr.id) as player_count
FROM rankings r
LEFT JOIN player_rankings pr ON r.id = pr.ranking_id
WHERE r.position = 'OVR'
AND r.updated_at > NOW() - INTERVAL '1 hour'
GROUP BY r.id, r.position, r.type, r.season, r.week, r.created_at, r.updated_at
ORDER BY r.updated_at DESC
LIMIT 10;

-- 4. Check if there are multiple OVR rankings for the same week/season
SELECT 'Multiple OVR rankings check:' as info;
SELECT 
  r.type,
  r.season,
  r.week,
  COUNT(*) as ranking_count
FROM rankings r
WHERE r.position = 'OVR'
GROUP BY r.type, r.season, r.week
HAVING COUNT(*) > 1
ORDER BY r.season, r.week;

-- 5. Check what the hook is actually loading
SELECT 'What the hook should be loading (preseason OVR):' as info;
SELECT 
  player_name,
  average_rank,
  total_rankings
FROM player_average_rankings
WHERE position = 'OVR'
AND type = 'preseason'
AND week IS NULL
ORDER BY average_rank
LIMIT 10; 