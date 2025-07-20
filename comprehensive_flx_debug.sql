-- Comprehensive diagnostic for FLX rankings issue

-- 1. Check all rankings in the database
SELECT 'All rankings in database:' as info;
SELECT 
  position,
  type,
  season,
  COUNT(*) as count
FROM rankings
GROUP BY position, type, season
ORDER BY position, type, season;

-- 2. Check all player_rankings in the database
SELECT 'All player_rankings in database:' as info;
SELECT 
  pr.position as player_position,
  r.position as ranking_position,
  r.type,
  r.season,
  COUNT(*) as count
FROM player_rankings pr
JOIN rankings r ON pr.ranking_id = r.id
GROUP BY pr.position, r.position, r.type, r.season
ORDER BY r.position, pr.position, r.type, r.season;

-- 3. Check what positions are actually stored in player_rankings
SELECT 'Unique positions in player_rankings:' as info;
SELECT DISTINCT position as player_position
FROM player_rankings
ORDER BY position;

-- 4. Check OVR rankings specifically
SELECT 'OVR rankings details:' as info;
SELECT 
  r.id,
  r.position,
  r.type,
  r.season,
  r.week,
  r.created_at,
  COUNT(pr.id) as player_count
FROM rankings r
LEFT JOIN player_rankings pr ON r.id = pr.ranking_id
WHERE r.position = 'OVR'
GROUP BY r.id, r.position, r.type, r.season, r.week, r.created_at
ORDER BY r.created_at DESC
LIMIT 10;

-- 5. Check what players are in OVR rankings
SELECT 'Players in OVR rankings:' as info;
SELECT 
  pr.player_id,
  pr.player_name,
  pr.team,
  pr.position as player_position,
  pr.rank_position,
  r.type,
  r.season,
  r.week
FROM player_rankings pr
JOIN rankings r ON pr.ranking_id = r.id
WHERE r.position = 'OVR'
ORDER BY pr.rank_position
LIMIT 20;

-- 6. Check if there are any players that should be FLX eligible
SELECT 'Players that should be FLX eligible (RB/WR/TE):' as info;
SELECT 
  pr.player_id,
  pr.player_name,
  pr.team,
  pr.position as player_position,
  pr.rank_position,
  r.type,
  r.season,
  r.week,
  CASE 
    WHEN pr.position IN ('RB', 'WR', 'TE') THEN 'FLX Eligible'
    ELSE 'Not FLX Eligible'
  END as flx_status
FROM player_rankings pr
JOIN rankings r ON pr.ranking_id = r.id
WHERE r.position = 'OVR'
ORDER BY pr.rank_position
LIMIT 30;

-- 7. Count FLX eligible players
SELECT 'FLX eligible players count:' as info;
SELECT 
  pr.position as player_position,
  COUNT(*) as count
FROM player_rankings pr
JOIN rankings r ON pr.ranking_id = r.id
WHERE r.position = 'OVR'
AND pr.position IN ('RB', 'WR', 'TE')
GROUP BY pr.position
ORDER BY pr.position;

-- 8. Try to create FLX rankings with more detailed error checking
SELECT 'Attempting FLX creation with error checking...' as info;

-- First, let's see what would be inserted
SELECT 'What would be inserted for FLX:' as info;
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