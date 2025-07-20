-- Simple fix for FLX rankings - manually create FLX entries from OVR rankings
-- This will create FLX entries for all RB/WR/TE players that exist in OVR but not in FLX

-- First, let's see what we have
SELECT 'Current FLX rankings count:' as info, COUNT(*) as count 
FROM player_average_rankings 
WHERE position = 'FLX';

SELECT 'Current OVR rankings count:' as info, COUNT(*) as count 
FROM player_average_rankings 
WHERE position = 'OVR';

-- Create missing FLX rows for existing OVR rankings
INSERT INTO player_average_rankings (
  player_id, player_name, team, position, season, type, week, 
  average_rank, total_rankings, last_updated
)
SELECT 
  ovr.player_id,
  ovr.player_name,
  ovr.team,
  'FLX' as position,
  ovr.season,
  ovr.type,
  ovr.week,
  ovr.average_rank,
  ovr.total_rankings,
  ovr.last_updated
FROM player_average_rankings ovr
WHERE ovr.position = 'OVR'
AND ovr.player_id IN (
  -- Get player_ids from player_rankings where the player is RB/WR/TE
  SELECT DISTINCT pr.player_id 
  FROM player_rankings pr 
  JOIN rankings r ON pr.ranking_id = r.id 
  WHERE r.position = 'OVR' 
  AND pr.position IN ('RB', 'WR', 'TE')
)
AND NOT EXISTS (
  -- Don't insert if FLX row already exists
  SELECT 1 FROM player_average_rankings flx 
  WHERE flx.player_id = ovr.player_id 
  AND flx.position = 'FLX' 
  AND flx.season = ovr.season 
  AND flx.type = ovr.type 
  AND flx.week IS NOT DISTINCT FROM ovr.week
)
ON CONFLICT (player_id, position, season, type, week) DO NOTHING;

-- Check the results
SELECT 'After fix - FLX rankings count:' as info, COUNT(*) as count 
FROM player_average_rankings 
WHERE position = 'FLX';

-- Show some sample FLX rankings
SELECT player_name, team, average_rank, total_rankings 
FROM player_average_rankings 
WHERE position = 'FLX' 
ORDER BY average_rank 
LIMIT 10; 