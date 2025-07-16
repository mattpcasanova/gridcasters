-- Add percentile tracking fields to rankings table
-- This allows us to track how well a user's ranking performed relative to others

-- Add percentile fields to rankings table
ALTER TABLE rankings 
ADD COLUMN IF NOT EXISTS percentile_rank INTEGER,
ADD COLUMN IF NOT EXISTS total_rankings_in_period INTEGER,
ADD COLUMN IF NOT EXISTS percentile_score DECIMAL(5,2);

-- Add comments for documentation
COMMENT ON COLUMN rankings.percentile_rank IS 'User''s rank position among all rankings for this period (1 = best)';
COMMENT ON COLUMN rankings.total_rankings_in_period IS 'Total number of rankings submitted for this period';
COMMENT ON COLUMN rankings.percentile_score IS 'Percentile score (0-100, higher is better)';

-- Add indexes for efficient percentile queries
CREATE INDEX IF NOT EXISTS idx_rankings_percentile_period 
ON rankings(position, type, week, season, accuracy_score DESC) 
WHERE accuracy_score IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_rankings_user_percentile 
ON rankings(user_id, percentile_score DESC) 
WHERE percentile_score IS NOT NULL;

-- Function to calculate percentiles for a specific period
CREATE OR REPLACE FUNCTION calculate_percentiles_for_period(
  position_param TEXT,
  type_param TEXT,
  week_param INTEGER,
  season_param INTEGER
)
RETURNS TABLE (
  ranking_id UUID,
  user_id UUID,
  percentile_rank INTEGER,
  total_rankings INTEGER,
  percentile_score DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  WITH ranked_rankings AS (
    SELECT 
      r.id,
      r.user_id,
      r.accuracy_score,
      ROW_NUMBER() OVER (ORDER BY r.accuracy_score DESC NULLS LAST) as rank_position,
      COUNT(*) OVER () as total_count
    FROM rankings r
    WHERE r.position = position_param
      AND r.type = type_param
      AND r.season = season_param
      AND (week_param IS NULL OR r.week = week_param)
      AND r.accuracy_score IS NOT NULL
  )
  SELECT 
    rr.id,
    rr.user_id,
    rr.rank_position::INTEGER,
    rr.total_count::INTEGER,
    CASE 
      WHEN rr.total_count = 1 THEN 100.0
      ELSE ROUND(((rr.total_count - rr.rank_position + 1)::DECIMAL / rr.total_count) * 100, 2)
    END as percentile_score
  FROM ranked_rankings rr;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update percentiles for all rankings in a period
CREATE OR REPLACE FUNCTION update_percentiles_for_period(
  position_param TEXT,
  type_param TEXT,
  week_param INTEGER,
  season_param INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER := 0;
  ranking_record RECORD;
BEGIN
  -- Update percentiles for the specified period
  FOR ranking_record IN 
    SELECT * FROM calculate_percentiles_for_period(position_param, type_param, week_param, season_param)
  LOOP
    UPDATE rankings 
    SET 
      percentile_rank = ranking_record.percentile_rank,
      total_rankings_in_period = ranking_record.total_rankings,
      percentile_score = ranking_record.percentile_score,
      updated_at = NOW()
    WHERE id = ranking_record.ranking_id;
    
    updated_count := updated_count + 1;
  END LOOP;
  
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's percentile statistics
CREATE OR REPLACE FUNCTION get_user_percentile_stats(user_uuid UUID)
RETURNS TABLE (
  total_rankings INTEGER,
  avg_percentile DECIMAL(5,2),
  top_10_percentile_count INTEGER,
  top_25_percentile_count INTEGER,
  top_50_percentile_count INTEGER,
  best_percentile DECIMAL(5,2),
  recent_percentile_trend DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  WITH user_stats AS (
    SELECT 
      COUNT(*) as total_rankings,
      AVG(percentile_score) as avg_percentile,
      COUNT(*) FILTER (WHERE percentile_score >= 90) as top_10_count,
      COUNT(*) FILTER (WHERE percentile_score >= 75) as top_25_count,
      COUNT(*) FILTER (WHERE percentile_score >= 50) as top_50_count,
      MAX(percentile_score) as best_percentile
    FROM rankings 
    WHERE user_id = user_uuid 
      AND percentile_score IS NOT NULL
  ),
  recent_trend AS (
    SELECT AVG(percentile_score) as recent_avg
    FROM rankings 
    WHERE user_id = user_uuid 
      AND percentile_score IS NOT NULL
      AND created_at >= NOW() - INTERVAL '30 days'
  )
  SELECT 
    us.total_rankings,
    us.avg_percentile,
    us.top_10_count,
    us.top_25_count,
    us.top_50_count,
    us.best_percentile,
    rt.recent_avg
  FROM user_stats us, recent_trend rt;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get leaderboard for a specific period
CREATE OR REPLACE FUNCTION get_period_leaderboard(
  position_param TEXT,
  type_param TEXT,
  week_param INTEGER,
  season_param INTEGER,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  rank_position INTEGER,
  user_id UUID,
  username TEXT,
  display_name TEXT,
  accuracy_score DECIMAL(5,2),
  percentile_score DECIMAL(5,2),
  total_rankings_in_period INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.percentile_rank,
    r.user_id,
    p.username,
    p.display_name,
    r.accuracy_score,
    r.percentile_score,
    r.total_rankings_in_period
  FROM rankings r
  JOIN profiles p ON r.user_id = p.id
  WHERE r.position = position_param
    AND r.type = type_param
    AND r.season = season_param
    AND (week_param IS NULL OR r.week = week_param)
    AND r.accuracy_score IS NOT NULL
    AND r.percentile_score IS NOT NULL
  ORDER BY r.percentile_score DESC, r.accuracy_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 