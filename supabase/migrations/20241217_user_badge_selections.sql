-- Create user_badge_selections table to store which badges users want to display on their profile
CREATE TABLE IF NOT EXISTS public.user_badge_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique selections per user/badge combination
  UNIQUE(user_id, badge_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_badge_selections_user_id ON public.user_badge_selections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badge_selections_display_order ON public.user_badge_selections(display_order);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_badge_selections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own badge selections" ON public.user_badge_selections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badge selections" ON public.user_badge_selections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own badge selections" ON public.user_badge_selections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own badge selections" ON public.user_badge_selections
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_user_badge_selections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_badge_selections_updated_at
  BEFORE UPDATE ON public.user_badge_selections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_badge_selections_updated_at();

-- Function to get user's selected badges
CREATE OR REPLACE FUNCTION get_user_selected_badges(user_uuid uuid)
RETURNS TABLE (
  badge_id text,
  display_order integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ubs.badge_id,
    ubs.display_order
  FROM user_badge_selections ubs
  WHERE ubs.user_id = user_uuid
  ORDER BY ubs.display_order ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to upsert user badge selections
CREATE OR REPLACE FUNCTION upsert_user_badge_selections(
  user_uuid uuid,
  badge_ids text[]
)
RETURNS void AS $$
DECLARE
  badge_id text;
  display_order integer := 0;
BEGIN
  -- Delete existing selections for this user
  DELETE FROM user_badge_selections WHERE user_id = user_uuid;
  
  -- Insert new selections
  FOREACH badge_id IN ARRAY badge_ids
  LOOP
    INSERT INTO user_badge_selections (user_id, badge_id, display_order)
    VALUES (user_uuid, badge_id, display_order);
    display_order := display_order + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 