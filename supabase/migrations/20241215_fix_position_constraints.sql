-- Fix position constraints for player_rankings table
-- This migration ensures the position field accepts all valid fantasy football positions

-- First, drop the existing constraint if it exists
ALTER TABLE public.player_rankings DROP CONSTRAINT IF EXISTS player_rankings_position_check;

-- Add the correct constraint that allows all valid positions
ALTER TABLE public.player_rankings 
ADD CONSTRAINT player_rankings_position_check 
CHECK (position IN ('QB', 'RB', 'WR', 'TE', 'OVR', 'FLX'));

-- Also fix the rankings table constraint if it exists
ALTER TABLE public.rankings DROP CONSTRAINT IF EXISTS rankings_position_check;

-- Add the correct constraint for rankings table
ALTER TABLE public.rankings 
ADD CONSTRAINT rankings_position_check 
CHECK (position IN ('QB', 'RB', 'WR', 'TE', 'OVR', 'FLX'));

-- Add a constraint for ranking type
ALTER TABLE public.rankings DROP CONSTRAINT IF EXISTS rankings_type_check;
ALTER TABLE public.rankings 
ADD CONSTRAINT rankings_type_check 
CHECK (type IN ('weekly', 'preseason')); 