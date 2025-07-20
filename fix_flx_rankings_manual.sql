-- Manual fix for FLX rankings - directly from player_rankings table
-- This bypasses the trigger issue and creates FLX rankings manually

-- First, let's see what we actually have in player_rankings
SELECT 'player_rankings data:' as info;
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

-- Now manually create FLX rankings from player_rankings
INSERT INTO player_average_rankings (
  player_id, player_name, team, position, season, type, week, 
  average_rank, total_rankings, last_updated
)
SELECT 
  pr.player_id,
  pr.player_name,
  pr.team,
  'FLX' as position,
  r.season,
  r.type,
  r.week,
  AVG(pr.rank_position)::DECIMAL(5,2) as average_rank,
  COUNT(*) as total_rankings,
  NOW() as last_updated
FROM player_rankings pr
JOIN rankings r ON pr.ranking_id = r.id
WHERE r.position = 'OVR'
AND pr.position IN ('RB', 'WR', 'TE')
GROUP BY pr.player_id, pr.player_name, pr.team, r.season, r.type, r.week
ON CONFLICT (player_id, position, season, type, week)
DO UPDATE SET
  player_name = EXCLUDED.player_name,
  team = EXCLUDED.team,
  average_rank = EXCLUDED.average_rank,
  total_rankings = EXCLUDED.total_rankings,
  last_updated = EXCLUDED.last_updated;

-- Check the results
SELECT 'After manual fix - FLX rankings:' as info;
SELECT COUNT(*) as count 
FROM player_average_rankings 
WHERE position = 'FLX';

-- Show some sample FLX rankings
SELECT player_name, team, average_rank, total_rankings, season, type
FROM player_average_rankings 
WHERE position = 'FLX' 
ORDER BY average_rank 
LIMIT 10;

-- Final check
SELECT 'Final counts:' as info;
SELECT position, COUNT(*) as count 
FROM player_average_rankings 
GROUP BY position 
ORDER BY position; 