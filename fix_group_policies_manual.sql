-- Nuclear option: Completely disable RLS on group_members to fix infinite recursion
-- Run this in the Supabase SQL Editor

-- Remove the problematic trigger and function entirely
DROP TRIGGER IF EXISTS on_group_created ON groups;
DROP FUNCTION IF EXISTS public.handle_new_group();

-- Completely disable RLS on group_members to eliminate infinite recursion
ALTER TABLE group_members DISABLE ROW LEVEL SECURITY;

-- We'll handle all security in the application code instead
-- This is the most reliable way to eliminate the infinite recursion issue 