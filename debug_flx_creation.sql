-- Better diagnostic for FLX rankings creation

-- 1. Check if there are any OVR rankings at all
SELECT 'OVR rankings count:' as info;
SELECT COUNT(*) as ovr_count 
FROM rankings 
WHERE position = 'OVR';

-- 2. Check if there are any player_rankings for OVR
SELECT 'Player rankings for OVR:' as info;
SELECT COUNT(*) as player_rankings_count
FROM player_rankings pr
JOIN rankings r ON pr.ranking_id = r.id
WHERE r.position = 'OVR';

-- 3. Check what positions exist in OVR player_rankings
SELECT 'Positions in OVR player_rankings:' as info;
SELECT 
  pr.position as player_position,
  COUNT(*) as count
FROM player_rankings pr
JOIN rankings r ON pr.ranking_id = r.id
WHERE r.position = 'OVR'
GROUP BY pr.position
ORDER BY pr.position;

-- 4. Check specific RB/WR/TE players in OVR
SELECT 'Sample RB/WR/TE players in OVR:' as info;
SELECT 
  pr.player_id,
  pr.player_name,
  pr.team,
  pr.position as player_position,
  pr.rank_position,
  r.season,
  r.type,
  r.week
FROM player_rankings pr
JOIN rankings r ON pr.ranking_id = r.id
WHERE r.position = 'OVR'
AND pr.position IN ('RB', 'WR', 'TE')
ORDER BY pr.rank_position
LIMIT 20;

-- 5. Check if there are any existing FLX rankings
SELECT 'Existing FLX rankings:' as info;
SELECT COUNT(*) as flx_count 
FROM player_average_rankings 
WHERE position = 'FLX';

-- 6. Try to create FLX rankings manually and see what happens
SELECT 'Attempting to create FLX rankings...' as info;

-- Delete any existing FLX rankings
DELETE FROM player_average_rankings 
WHERE position = 'FLX';

-- Insert FLX rankings
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
GROUP BY pr.player_id, pr.player_name, pr.team, r.season, r.type, r.week;

-- 7. Check the results
SELECT 'After FLX creation:' as info;
SELECT COUNT(*) as flx_count 
FROM player_average_rankings 
WHERE position = 'FLX';

-- 8. Show sample FLX rankings
SELECT 'Sample FLX rankings:' as info;
SELECT 
  player_name, 
  team, 
  average_rank, 
  total_rankings, 
  season, 
  type
FROM player_average_rankings 
WHERE position = 'FLX' 
ORDER BY average_rank 
LIMIT 10; 