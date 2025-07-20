-- Debug script to check why FLX rankings aren't updating when OVR rankings change

-- 1. Check if the trigger exists and is working
SELECT 'Trigger status:' as info;
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_recalculate_averages';

-- 2. Check the current FLX rankings count
SELECT 'Current FLX rankings:' as info;
SELECT COUNT(*) as flx_count 
FROM player_average_rankings 
WHERE position = 'FLX';

-- 3. Check OVR rankings count
SELECT 'Current OVR rankings:' as info;
SELECT COUNT(*) as ovr_count 
FROM player_average_rankings 
WHERE position = 'OVR';

-- 4. Check if there are RB/WR/TE players in OVR rankings
SELECT 'RB/WR/TE players in OVR rankings:' as info;
SELECT 
  pr.player_id,
  pr.player_name,
  pr.team,
  pr.position as player_position,
  r.position as ranking_position,
  r.season,
  r.type,
  r.week,
  COUNT(*) as count
FROM player_rankings pr
JOIN rankings r ON pr.ranking_id = r.id
WHERE r.position = 'OVR'
AND pr.position IN ('RB', 'WR', 'TE')
GROUP BY pr.player_id, pr.player_name, pr.team, pr.position, r.position, r.season, r.type, r.week
ORDER BY pr.player_name
LIMIT 10;

-- 5. Check the most recent OVR ranking
SELECT 'Most recent OVR ranking:' as info;
SELECT 
  r.id,
  r.position,
  r.season,
  r.type,
  r.week,
  r.created_at,
  COUNT(pr.id) as player_count
FROM rankings r
LEFT JOIN player_rankings pr ON r.id = pr.ranking_id
WHERE r.position = 'OVR'
GROUP BY r.id, r.position, r.season, r.type, r.week, r.created_at
ORDER BY r.created_at DESC
LIMIT 5;

-- 6. Test the trigger manually by simulating an update
-- First, let's see what would be inserted for FLX
SELECT 'What FLX rankings should be created:' as info;
SELECT 
  pr.player_id,
  pr.player_name,
  pr.team,
  'FLX' as position,
  r.season,
  r.type,
  r.week,
  AVG(pr.rank_position)::DECIMAL(5,2) as average_rank,
  COUNT(*) as total_rankings
FROM player_rankings pr
JOIN rankings r ON pr.ranking_id = r.id
WHERE r.position = 'OVR'
AND pr.position IN ('RB', 'WR', 'TE')
GROUP BY pr.player_id, pr.player_name, pr.team, r.season, r.type, r.week
ORDER BY average_rank
LIMIT 10; 