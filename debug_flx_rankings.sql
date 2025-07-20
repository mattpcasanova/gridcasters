-- Debug script to understand why FLX rankings aren't being created

-- 1. Check what's in player_average_rankings
SELECT 'player_average_rankings table:' as info;
SELECT position, COUNT(*) as count 
FROM player_average_rankings 
GROUP BY position 
ORDER BY position;

-- 2. Check what's in rankings table
SELECT 'rankings table:' as info;
SELECT position, type, season, COUNT(*) as count 
FROM rankings 
GROUP BY position, type, season 
ORDER BY position, type, season;

-- 3. Check what's in player_rankings table
SELECT 'player_rankings table:' as info;
SELECT pr.position, r.position as ranking_position, COUNT(*) as count 
FROM player_rankings pr
JOIN rankings r ON pr.ranking_id = r.id
GROUP BY pr.position, r.position
ORDER BY r.position, pr.position;

-- 4. Check specific OVR rankings and their players
SELECT 'OVR rankings with RB/WR/TE players:' as info;
SELECT 
  r.id as ranking_id,
  r.position as ranking_position,
  r.type,
  r.season,
  pr.position as player_position,
  pr.player_name,
  pr.player_id
FROM rankings r
JOIN player_rankings pr ON r.id = pr.ranking_id
WHERE r.position = 'OVR'
AND pr.position IN ('RB', 'WR', 'TE')
ORDER BY r.created_at DESC, pr.rank_position
LIMIT 20;

-- 5. Check if there are any OVR rankings in player_average_rankings
SELECT 'OVR rankings in player_average_rankings:' as info;
SELECT position, season, type, COUNT(*) as count
FROM player_average_rankings
WHERE position = 'OVR'
GROUP BY position, season, type
ORDER BY season, type;

-- 6. Check what players would be eligible for FLX
SELECT 'Players eligible for FLX (RB/WR/TE from OVR rankings):' as info;
SELECT DISTINCT
  pr.player_id,
  pr.player_name,
  pr.team,
  pr.position as player_position
FROM player_rankings pr
JOIN rankings r ON pr.ranking_id = r.id
WHERE r.position = 'OVR'
AND pr.position IN ('RB', 'WR', 'TE')
ORDER BY pr.player_name
LIMIT 20; 