-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users primary key,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  is_private boolean default false,
  is_verified boolean default false,
  created_at timestamp default now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Clear existing policies
DROP POLICY IF EXISTS "Users can view public profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create policies
CREATE POLICY "Users can view public profiles" 
ON public.profiles FOR SELECT 
TO authenticated, anon
USING (
  NOT is_private OR 
  auth.uid() = id OR
  EXISTS (
    SELECT 1 FROM public.follows 
    WHERE following_id = profiles.id 
    AND follower_id = auth.uid()
  )
);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- This is the critical policy we were missing
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Create follows table if it doesn't exist (needed for profile viewing policy)
CREATE TABLE IF NOT EXISTS public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references public.profiles(id) on delete cascade,
  following_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp default now(),
  UNIQUE(follower_id, following_id)
); 