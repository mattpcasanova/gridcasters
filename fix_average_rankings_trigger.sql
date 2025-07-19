-- Fix the average rankings trigger to prevent duplicates
-- The issue is that the current trigger uses DELETE + INSERT which can create duplicates
-- We need to use UPSERT (INSERT ... ON CONFLICT) instead

-- Drop the existing trigger
DROP TRIGGER IF EXISTS trigger_recalculate_averages ON player_rankings;

-- Create a new function that uses UPSERT
CREATE OR REPLACE FUNCTION recalculate_average_rankings()
RETURNS TRIGGER AS $$
BEGIN
  -- Use UPSERT to update existing averages or insert new ones
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
  WHERE r.position = (
    SELECT position FROM rankings WHERE id = COALESCE(NEW.ranking_id, OLD.ranking_id)
  )
  AND r.season = (
    SELECT season FROM rankings WHERE id = COALESCE(NEW.ranking_id, OLD.ranking_id)
  )
  AND r.type = (
    SELECT type FROM rankings WHERE id = COALESCE(NEW.ranking_id, OLD.ranking_id)
  )
  AND r.week = (
    SELECT week FROM rankings WHERE id = COALESCE(NEW.ranking_id, OLD.ranking_id)
  )
  GROUP BY pr.player_id, pr.player_name, pr.team, r.position, r.season, r.type, r.week
  ON CONFLICT (player_id, position, season, type, week)
  DO UPDATE SET
    player_name = EXCLUDED.player_name,
    team = EXCLUDED.team,
    average_rank = EXCLUDED.average_rank,
    total_rankings = EXCLUDED.total_rankings,
    last_updated = EXCLUDED.last_updated;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER trigger_recalculate_averages
  AFTER INSERT OR UPDATE OR DELETE ON player_rankings
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_average_rankings();

-- Clean up any existing duplicates in the player_average_rankings table
-- Keep only the first occurrence of each player_id, position, season, type, week combination
DELETE FROM player_average_rankings 
WHERE id NOT IN (
  SELECT DISTINCT ON (player_id, position, season, type, week) id
  FROM player_average_rankings 
  ORDER BY player_id, position, season, type, week, id
); 