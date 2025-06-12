
-- First, let's fix the profile creation system and add missing profiles for existing users

-- Create missing profiles for existing users
INSERT INTO public.profiles (id, full_name, created_at, updated_at)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', email) as full_name,
  created_at,
  updated_at
FROM auth.users 
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Fix the handle_new_user function to properly create profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Drop the existing trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH row EXECUTE PROCEDURE public.handle_new_user();

-- Fix the handle_new_user_company function to work with existing profiles
CREATE OR REPLACE FUNCTION public.handle_new_user_company()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_company_id UUID;
  existing_profile RECORD;
BEGIN
  -- Check if profile already exists
  SELECT * INTO existing_profile FROM public.profiles WHERE id = NEW.id;
  
  -- If profile doesn't exist, create it first
  IF existing_profile IS NULL THEN
    INSERT INTO public.profiles (id, full_name, created_at, updated_at)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      NOW(),
      NOW()
    );
  END IF;
  
  -- Only create company if profile doesn't already have one
  IF existing_profile.company_id IS NULL THEN
    -- Create a new company for the user
    INSERT INTO public.companies (name, subdomain)
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'company_name', NEW.raw_user_meta_data->>'full_name' || '''s Company'),
      'company-' || substr(md5(random()::text), 1, 8)
    )
    RETURNING id INTO new_company_id;
    
    -- Add user as admin of their company
    INSERT INTO public.team_members (company_id, user_id, role, status, joined_at)
    VALUES (new_company_id, NEW.id, 'admin', 'active', NOW());
    
    -- Create default branding
    INSERT INTO public.branding (company_id)
    VALUES (new_company_id);
    
    -- Update profile with company_id
    UPDATE public.profiles 
    SET company_id = new_company_id, updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  
  -- Create onboarding progress if it doesn't exist
  INSERT INTO public.onboarding_progress (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Add RLS policies for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create new RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Fix team_members RLS to prevent infinite recursion
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to get user's company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id(user_id UUID DEFAULT auth.uid())
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT company_id FROM public.profiles WHERE id = user_id;
$$;

-- Create new team_members policies using the security definer function
DROP POLICY IF EXISTS "Users can view team members" ON public.team_members;
DROP POLICY IF EXISTS "Users can manage team members" ON public.team_members;

CREATE POLICY "Users can view team members" ON public.team_members
  FOR SELECT USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can manage team members" ON public.team_members
  FOR ALL USING (company_id = public.get_user_company_id());

-- Add RLS policies for companies table
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own company" ON public.companies;
DROP POLICY IF EXISTS "Users can update own company" ON public.companies;

CREATE POLICY "Users can view own company" ON public.companies
  FOR SELECT USING (id = public.get_user_company_id());

CREATE POLICY "Users can update own company" ON public.companies
  FOR UPDATE USING (id = public.get_user_company_id());

-- Add RLS policies for branding table
ALTER TABLE public.branding ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own branding" ON public.branding;
DROP POLICY IF EXISTS "Users can update own branding" ON public.branding;

CREATE POLICY "Users can view own branding" ON public.branding
  FOR SELECT USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can update own branding" ON public.branding
  FOR UPDATE USING (company_id = public.get_user_company_id());

-- Add missing tables for Phase 2 implementation
CREATE TABLE IF NOT EXISTS public.inbox_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email_address TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inbox_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  from_email TEXT NOT NULL,
  from_name TEXT,
  subject TEXT,
  content TEXT,
  html_content TEXT,
  category TEXT DEFAULT 'uncategorized',
  ai_summary TEXT,
  is_processed BOOLEAN DEFAULT false,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS for inbox tables
ALTER TABLE public.inbox_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbox_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own inbox emails" ON public.inbox_emails
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own inbox messages" ON public.inbox_messages
  FOR ALL USING (auth.uid() = user_id);

-- Update releases table to include more fields
ALTER TABLE public.releases 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS source_id UUID,
ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS ai_summary TEXT;

-- Add RLS for releases
ALTER TABLE public.releases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage company releases" ON public.releases;

CREATE POLICY "Users can manage company releases" ON public.releases
  FOR ALL USING (company_id = public.get_user_company_id());

-- Create subscribers table for public changelog
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  confirmed BOOLEAN DEFAULT false,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, email)
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can manage subscribers" ON public.subscribers
  FOR ALL USING (company_id = public.get_user_company_id());

-- Allow public to insert subscribers (for subscription form)
CREATE POLICY "Public can subscribe" ON public.subscribers
  FOR INSERT WITH CHECK (true);
