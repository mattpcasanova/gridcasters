-- Force create FLX rankings from current OVR data
-- This will manually create FLX rankings for all RB/WR/TE players in OVR rankings

-- First, delete any existing FLX rankings to start fresh
DELETE FROM player_average_rankings 
WHERE position = 'FLX';

-- Now create FLX rankings for all RB/WR/TE players from OVR rankings
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
ORDER BY average_rank;

-- Check the results
SELECT 'After force creation - FLX rankings:' as info;
SELECT COUNT(*) as flx_count 
FROM player_average_rankings 
WHERE position = 'FLX';

-- Show some sample FLX rankings
SELECT player_name, team, average_rank, total_rankings, season, type
FROM player_average_rankings 
WHERE position = 'FLX' 
ORDER BY average_rank 
LIMIT 10;

-- Final check - all positions
SELECT 'Final position counts:' as info;
SELECT position, COUNT(*) as count 
FROM player_average_rankings 
GROUP BY position 
ORDER BY position; 