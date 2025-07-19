-- Create table for pre-calculated average rankings
CREATE TABLE player_average_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  team TEXT NOT NULL,
  position TEXT NOT NULL,
  season INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'preseason' or 'weekly'
  week INTEGER, -- null for preseason
  average_rank DECIMAL(5,2),
  total_rankings INTEGER,
  last_updated TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(player_id, position, season, type, week)
);

-- Index for fast lookups
CREATE INDEX idx_player_avg_rankings_lookup 
ON player_average_rankings(position, season, type, week);

-- Function to recalculate averages when rankings are saved/updated
CREATE OR REPLACE FUNCTION recalculate_average_rankings()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete existing averages for this position/season/type/week
  DELETE FROM player_average_rankings 
  WHERE position = (
    SELECT position FROM rankings WHERE id = COALESCE(NEW.ranking_id, OLD.ranking_id)
  )
  AND season = (
    SELECT season FROM rankings WHERE id = COALESCE(NEW.ranking_id, OLD.ranking_id)
  )
  AND type = (
    SELECT type FROM rankings WHERE id = COALESCE(NEW.ranking_id, OLD.ranking_id)
  )
  AND week = (
    SELECT week FROM rankings WHERE id = COALESCE(NEW.ranking_id, OLD.ranking_id)
  );
  
  -- Insert new averages
  INSERT INTO player_average_rankings (
    player_id, player_name, team, position, season, type, week, 
    average_rank, total_rankings
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
    COUNT(*) as total_rankings
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
  GROUP BY pr.player_id, pr.player_name, pr.team, r.position, r.season, r.type, r.week;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to recalculate averages when player_rankings change
CREATE TRIGGER trigger_recalculate_averages
  AFTER INSERT OR UPDATE OR DELETE ON player_rankings
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_average_rankings(); 