-- Foundry Vault Database Setup Script
-- Run this script in the Supabase SQL Editor

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'MEMBER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turn on Row Level Security for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 2. Create Licenses Table
CREATE TABLE IF NOT EXISTS public.licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  font_id TEXT NOT NULL,
  license_type TEXT NOT NULL,
  seats TEXT NOT NULL,
  pageviews TEXT NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turn on Row Level Security for Licenses
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- Licenses Policies
CREATE POLICY "Users can view own licenses" 
ON public.licenses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own licenses" 
ON public.licenses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Automatic Profile Creation Trigger
-- This ensures a profile is created when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if trigger exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;
