
-- Create companies table for multi-tenant support
CREATE TABLE public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  subdomain TEXT UNIQUE,
  logo_url TEXT,
  banner_url TEXT,
  team_size TEXT,
  industry TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team members table for collaboration
CREATE TABLE public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  UNIQUE(company_id, user_id)
);

-- Create branding table for customization
CREATE TABLE public.branding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE UNIQUE,
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#6B7280',
  font_family TEXT DEFAULT 'Inter',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enhanced releases table
CREATE TABLE public.releases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB,
  category TEXT DEFAULT 'announcement',
  release_type TEXT DEFAULT 'update',
  version TEXT,
  release_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  featured_image_url TEXT,
  ai_summary TEXT,
  tags TEXT[],
  source_type TEXT DEFAULT 'manual' CHECK (source_type IN ('email', 'manual', 'document', 'api')),
  source_id UUID,
  created_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create onboarding progress table
CREATE TABLE public.onboarding_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_step INTEGER DEFAULT 1,
  completed_steps INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  company_info_completed BOOLEAN DEFAULT FALSE,
  team_setup_completed BOOLEAN DEFAULT FALSE,
  domain_setup_completed BOOLEAN DEFAULT FALSE,
  branding_completed BOOLEAN DEFAULT FALSE,
  workspace_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Users can view companies they belong to" ON public.companies
  FOR SELECT USING (
    id IN (
      SELECT company_id FROM public.team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Users can create companies" ON public.companies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update their companies" ON public.companies
  FOR UPDATE USING (
    id IN (
      SELECT company_id FROM public.team_members 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'active'
    )
  );

-- RLS Policies for team_members
CREATE POLICY "Users can view team members of their companies" ON public.team_members
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM public.team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Admins can manage team members" ON public.team_members
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM public.team_members 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'active'
    )
  );

-- RLS Policies for branding
CREATE POLICY "Users can view branding of their companies" ON public.branding
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM public.team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Admins and editors can update branding" ON public.branding
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM public.team_members 
      WHERE user_id = auth.uid() AND role IN ('admin', 'editor') AND status = 'active'
    )
  );

-- RLS Policies for releases
CREATE POLICY "Users can view releases of their companies" ON public.releases
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM public.team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Public releases are viewable by everyone" ON public.releases
  FOR SELECT USING (status = 'published' AND visibility = 'public');

CREATE POLICY "Admins and editors can manage releases" ON public.releases
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM public.team_members 
      WHERE user_id = auth.uid() AND role IN ('admin', 'editor') AND status = 'active'
    )
  );

-- RLS Policies for onboarding_progress
CREATE POLICY "Users can manage their own onboarding progress" ON public.onboarding_progress
  FOR ALL USING (user_id = auth.uid());

-- Update profiles table to link with companies
ALTER TABLE public.profiles ADD COLUMN company_id UUID REFERENCES public.companies(id);

-- Create function to handle new user company setup
CREATE OR REPLACE FUNCTION public.handle_new_user_company()
RETURNS TRIGGER AS $$
DECLARE
  new_company_id UUID;
BEGIN
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
  
  -- Create onboarding progress
  INSERT INTO public.onboarding_progress (user_id)
  VALUES (NEW.id);
  
  -- Update profile with company_id
  UPDATE public.profiles 
  SET company_id = new_company_id 
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the existing trigger to use the new function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_company();
