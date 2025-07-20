-- Fix FLX rankings issue
-- The problem is that FLX rankings are not being created properly when OVR rankings are saved
-- We need to update the trigger to handle FLX rankings correctly

-- First, let's create missing FLX rows for existing OVR rankings
-- This will create FLX entries for all RB/WR/TE players that exist in OVR but not in FLX
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

-- Now update the trigger function to properly handle FLX rankings
-- Drop the existing trigger
DROP TRIGGER IF EXISTS trigger_recalculate_averages ON player_rankings;

-- Create a new function that handles FLX rankings properly
CREATE OR REPLACE FUNCTION recalculate_average_rankings()
RETURNS TRIGGER AS $$
DECLARE
  ranking_position TEXT;
  ranking_season INTEGER;
  ranking_type TEXT;
  ranking_week INTEGER;
BEGIN
  -- Get the ranking details
  SELECT position, season, type, week 
  INTO ranking_position, ranking_season, ranking_type, ranking_week
  FROM rankings 
  WHERE id = COALESCE(NEW.ranking_id, OLD.ranking_id);

  -- Delete existing averages for this position/season/type/week
  DELETE FROM player_average_rankings 
  WHERE position = ranking_position
  AND season = ranking_season
  AND type = ranking_type
  AND week IS NOT DISTINCT FROM ranking_week;
  
  -- Insert new averages for the ranking position
  INSERT INTO player_average_rankings (
    player_id, player_name, team, position, season, type, week, 
    average_rank, total_rankings, last_updated
  )
  SELECT 
    pr.player_id,
    pr.player_name,
    pr.team,
    r.position,
    r.season,
    r.type,
    r.week,
    AVG(pr.rank_position)::DECIMAL(5,2) as average_rank,
    COUNT(*) as total_rankings,
    NOW() as last_updated
  FROM player_rankings pr
  JOIN rankings r ON pr.ranking_id = r.id
  WHERE r.position = ranking_position
  AND r.season = ranking_season
  AND r.type = ranking_type
  AND r.week IS NOT DISTINCT FROM ranking_week
  GROUP BY pr.player_id, pr.player_name, pr.team, r.position, r.season, r.type, r.week
  ON CONFLICT (player_id, position, season, type, week)
  DO UPDATE SET
    player_name = EXCLUDED.player_name,
    team = EXCLUDED.team,
    average_rank = EXCLUDED.average_rank,
    total_rankings = EXCLUDED.total_rankings,
    last_updated = EXCLUDED.last_updated;

  -- If this is an OVR ranking, also update FLX rankings for RB/WR/TE players
  IF ranking_position = 'OVR' THEN
    -- Delete existing FLX averages for this season/type/week
    DELETE FROM player_average_rankings 
    WHERE position = 'FLX'
    AND season = ranking_season
    AND type = ranking_type
    AND week IS NOT DISTINCT FROM ranking_week;
    
    -- Insert FLX averages for RB/WR/TE players from OVR rankings
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
    AND pr.position IN ('RB', 'WR', 'TE') -- Only RB/WR/TE players are FLX eligible
    AND r.season = ranking_season
    AND r.type = ranking_type
    AND r.week IS NOT DISTINCT FROM ranking_week
    GROUP BY pr.player_id, pr.player_name, pr.team, r.season, r.type, r.week
    ON CONFLICT (player_id, position, season, type, week)
    DO UPDATE SET
      player_name = EXCLUDED.player_name,
      team = EXCLUDED.team,
      average_rank = EXCLUDED.average_rank,
      total_rankings = EXCLUDED.total_rankings,
      last_updated = EXCLUDED.last_updated;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER trigger_recalculate_averages
  AFTER INSERT OR UPDATE OR DELETE ON player_rankings
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_average_rankings(); 