-- Create player_favorites table for persistent "My Guys" functionality
CREATE TABLE IF NOT EXISTS public.player_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  team TEXT NOT NULL,
  position TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique favorites per user/player combination
  UNIQUE(user_id, player_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_player_favorites_user_id ON public.player_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_player_favorites_player_id ON public.player_favorites(player_id);
CREATE INDEX IF NOT EXISTS idx_player_favorites_position ON public.player_favorites(position);

-- Enable RLS (Row Level Security)
ALTER TABLE public.player_favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own favorites" ON public.player_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON public.player_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites" ON public.player_favorites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON public.player_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_player_favorites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_player_favorites_updated_at
  BEFORE UPDATE ON public.player_favorites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_player_favorites_updated_at(); 