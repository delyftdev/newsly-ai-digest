
-- First, let's check what columns exist and fix the database schema step by step

-- Update companies table with new branding and configuration fields
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS team_size TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#3B82F6';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#6B7280';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Inter';
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Add unique constraint to slug after populating it
UPDATE public.companies 
SET slug = 'company-' || substr(md5(random()::text), 1, 8) 
WHERE slug IS NULL;

-- Now add the unique constraint
ALTER TABLE public.companies ADD CONSTRAINT companies_slug_unique UNIQUE (slug);

-- Update profiles table with role information
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT;

-- Create subscribers table for public changelog subscriptions
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  confirmed BOOLEAN DEFAULT FALSE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, email)
);

-- Create team_invitations table for onboarding team invites
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending',
  token TEXT UNIQUE DEFAULT gen_random_uuid(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update releases table with additional fields
ALTER TABLE public.releases ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'announcement';
ALTER TABLE public.releases ADD COLUMN IF NOT EXISTS release_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.releases ADD COLUMN IF NOT EXISTS featured_image_url TEXT;

-- Enable RLS on new tables
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscribers
CREATE POLICY "Companies can view their subscribers" ON public.subscribers
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Anyone can subscribe" ON public.subscribers
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for team invitations
CREATE POLICY "Company members can view invitations" ON public.team_invitations
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Company members can create invitations" ON public.team_invitations
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscribers_company_id ON public.subscribers(company_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_company_id ON public.team_invitations(company_id);
CREATE INDEX IF NOT EXISTS idx_releases_company_id_status ON public.releases(company_id, status);
CREATE INDEX IF NOT EXISTS idx_releases_published_at ON public.releases(published_at DESC) WHERE status = 'published';
