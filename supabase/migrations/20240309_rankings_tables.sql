-- Create rankings table
CREATE TABLE IF NOT EXISTS public.rankings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  title text not null,
  position text not null, -- 'QB','RB','WR','TE','OVR','FLX'
  type text not null, -- 'weekly', 'preseason'
  week integer, -- null for preseason
  season integer not null,
  accuracy_score decimal(5,2), -- only shown after prediction period
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Create player_rankings table
CREATE TABLE IF NOT EXISTS public.player_rankings (
  id uuid primary key default gen_random_uuid(),
  ranking_id uuid references rankings(id) on delete cascade,
  player_id text not null, -- external player ID
  player_name text not null,
  team text not null,
  position text not null,
  rank_position integer not null,
  is_starred boolean default false, -- "My Guys"
  created_at timestamp default now()
);

-- Add constraints for rankings table
ALTER TABLE public.rankings 
ADD CONSTRAINT rankings_position_check 
CHECK (position IN ('QB', 'RB', 'WR', 'TE', 'OVR', 'FLX'));

-- Add constraints for player_rankings table
ALTER TABLE public.player_rankings 
ADD CONSTRAINT player_rankings_position_check 
CHECK (position IN ('QB', 'RB', 'WR', 'TE', 'OVR', 'FLX'));

-- Enable RLS
ALTER TABLE public.rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_rankings ENABLE ROW LEVEL SECURITY;

-- Create policies for rankings
CREATE POLICY "Users can manage own rankings" ON rankings
  FOR ALL USING (auth.uid() = user_id);

-- Create policies for player_rankings
CREATE POLICY "Users can manage own player rankings" ON player_rankings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM rankings 
      WHERE rankings.id = player_rankings.ranking_id 
      AND rankings.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rankings_user_id ON rankings(user_id);
CREATE INDEX IF NOT EXISTS idx_rankings_position ON rankings(position);
CREATE INDEX IF NOT EXISTS idx_rankings_season ON rankings(season);
CREATE INDEX IF NOT EXISTS idx_player_rankings_ranking_id ON player_rankings(ranking_id);
CREATE INDEX IF NOT EXISTS idx_player_rankings_position ON player_rankings(position); 