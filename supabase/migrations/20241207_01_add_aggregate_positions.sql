-- Add support for aggregate positions in rankings and player_rankings tables
-- This migration allows aggregate rankings to be saved with AGG_ prefix

-- Update player_rankings table constraint to allow aggregate positions
ALTER TABLE public.player_rankings DROP CONSTRAINT IF EXISTS player_rankings_position_check;

-- Add the updated constraint that allows aggregate positions
ALTER TABLE public.player_rankings 
ADD CONSTRAINT player_rankings_position_check 
CHECK (position IN ('QB', 'RB', 'WR', 'TE', 'OVR', 'FLX') OR position LIKE 'AGG_%');

-- Update rankings table constraint to allow aggregate positions
ALTER TABLE public.rankings DROP CONSTRAINT IF EXISTS rankings_position_check;

-- Add the updated constraint for rankings table
ALTER TABLE public.rankings 
ADD CONSTRAINT rankings_position_check 
CHECK (position IN ('QB', 'RB', 'WR', 'TE', 'OVR', 'FLX') OR position LIKE 'AGG_%'); 