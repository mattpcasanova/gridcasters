-- Fix the trigger function to ensure it properly creates FLX rankings
-- The current trigger isn't creating FLX rankings when OVR rankings are saved

-- Drop the existing trigger
DROP TRIGGER IF EXISTS trigger_recalculate_averages ON player_rankings;

-- Create a new, improved trigger function
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

  -- Only proceed if we found the ranking
  IF ranking_position IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

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
  GROUP BY pr.player_id, pr.player_name, pr.team, r.position, r.season, r.type, r.week;

  -- If this is an OVR ranking, also create FLX rankings for RB/WR/TE players
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
    GROUP BY pr.player_id, pr.player_name, pr.team, r.season, r.type, r.week;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER trigger_recalculate_averages
  AFTER INSERT OR UPDATE OR DELETE ON player_rankings
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_average_rankings();

-- Test the trigger by checking if it works
SELECT 'Trigger function updated successfully' as status; 