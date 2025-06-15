
-- Add team activity tracking table
CREATE TABLE public.team_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  activity_type TEXT NOT NULL, -- 'release_created', 'release_published', 'release_updated', 'email_processed', etc.
  entity_type TEXT NOT NULL, -- 'release', 'email', 'company', etc.
  entity_id UUID, -- ID of the entity being acted upon
  description TEXT NOT NULL,
  metadata JSONB, -- Additional context data
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for team activities
ALTER TABLE public.team_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view team activities for their company" 
  ON public.team_activities 
  FOR SELECT 
  USING (
    company_id IN (
      SELECT tm.company_id 
      FROM public.team_members tm 
      WHERE tm.user_id = auth.uid() AND tm.status = 'active'
    )
  );

CREATE POLICY "Users can create team activities for their company" 
  ON public.team_activities 
  FOR INSERT 
  WITH CHECK (
    company_id IN (
      SELECT tm.company_id 
      FROM public.team_members tm 
      WHERE tm.user_id = auth.uid() AND tm.status = 'active'
    )
  );

-- Update inbox_messages table to support better categorization
ALTER TABLE public.inbox_messages 
ADD COLUMN IF NOT EXISTS enhanced_category TEXT DEFAULT 'uncategorized',
ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS ai_tags TEXT[],
ADD COLUMN IF NOT EXISTS processed_by_ai BOOLEAN DEFAULT false;

-- Update releases table to support document uploads and public links
ALTER TABLE public.releases 
ADD COLUMN IF NOT EXISTS source_document_url TEXT,
ADD COLUMN IF NOT EXISTS source_document_name TEXT,
ADD COLUMN IF NOT EXISTS public_slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS published_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false;

-- Create index for public slug lookups
CREATE INDEX IF NOT EXISTS idx_releases_public_slug ON public.releases(public_slug) WHERE public_slug IS NOT NULL;

-- Update the user signup trigger to ensure email generation
CREATE OR REPLACE FUNCTION public.handle_new_user_company()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  new_company_id UUID;
  existing_profile RECORD;
  existing_company_id UUID;
  email_address TEXT;
  company_subdomain TEXT;
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
    
    -- Refresh the profile record
    SELECT * INTO existing_profile FROM public.profiles WHERE id = NEW.id;
  END IF;
  
  -- Check if user already has a company through team_members
  SELECT tm.company_id INTO existing_company_id 
  FROM public.team_members tm 
  WHERE tm.user_id = NEW.id AND tm.status = 'active' 
  LIMIT 1;
  
  -- Only create company if user doesn't have one and profile doesn't have company_id
  IF existing_company_id IS NULL AND (existing_profile.company_id IS NULL) THEN
    -- Generate company subdomain
    company_subdomain := 'company-' || substr(md5(random()::text || NEW.id::text), 1, 12);
    
    -- Create a new company for the user
    INSERT INTO public.companies (name, subdomain)
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'company_name', NEW.raw_user_meta_data->>'full_name' || '''s Company', NEW.email || '''s Company'),
      company_subdomain
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
    
    -- Generate inbox email automatically
    email_address := 'app-' || company_subdomain || '-' || substr(md5(random()::text), 1, 8) || '@sandboxbb958968707c47d289a60ae9b53aff0f.mailgun.org';
    
    INSERT INTO public.inbox_emails (user_id, email_address, created_at, updated_at)
    VALUES (NEW.id, email_address, NOW(), NOW());
    
  ELSIF existing_company_id IS NOT NULL AND existing_profile.company_id IS NULL THEN
    -- User has company through team_members but profile doesn't reflect it
    UPDATE public.profiles 
    SET company_id = existing_company_id, updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  
  -- Create onboarding progress if it doesn't exist
  INSERT INTO public.onboarding_progress (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$function$;
