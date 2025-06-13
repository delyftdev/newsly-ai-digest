
-- Phase 1: Fix Data Integrity - Create proper relationships and triggers

-- First, let's fix existing profiles that don't have company_id but should
-- Find users who have team_members records but no company_id in their profile
UPDATE public.profiles 
SET company_id = tm.company_id, updated_at = NOW()
FROM public.team_members tm 
WHERE profiles.id = tm.user_id 
AND profiles.company_id IS NULL 
AND tm.status = 'active';

-- Fix the trigger function to properly handle all cases
CREATE OR REPLACE FUNCTION public.handle_new_user_company()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_company_id UUID;
  existing_profile RECORD;
  existing_company_id UUID;
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
    -- Create a new company for the user
    INSERT INTO public.companies (name, subdomain)
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'company_name', NEW.raw_user_meta_data->>'full_name' || '''s Company', NEW.email || '''s Company'),
      'company-' || substr(md5(random()::text || NEW.id::text), 1, 12)
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
$$;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_company();

-- Create a function to auto-generate inbox emails for companies
CREATE OR REPLACE FUNCTION public.ensure_company_inbox_email(company_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  company_subdomain TEXT;
  email_address TEXT;
  existing_email TEXT;
BEGIN
  -- Get company subdomain
  SELECT subdomain INTO company_subdomain 
  FROM public.companies 
  WHERE id = company_uuid;
  
  IF company_subdomain IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Check if company already has an inbox email
  SELECT ie.email_address INTO existing_email
  FROM public.inbox_emails ie
  JOIN public.profiles p ON ie.user_id = p.id
  WHERE p.company_id = company_uuid
  LIMIT 1;
  
  IF existing_email IS NOT NULL THEN
    RETURN existing_email;
  END IF;
  
  -- Generate new email address
  email_address := 'app-' || company_subdomain || '-' || substr(md5(random()::text), 1, 8) || '@sandboxbb958968707c47d289a60ae9b53aff0f.mailgun.org';
  
  -- Create inbox email for the first admin user of the company
  INSERT INTO public.inbox_emails (user_id, email_address)
  SELECT tm.user_id, email_address
  FROM public.team_members tm
  WHERE tm.company_id = company_uuid 
  AND tm.role = 'admin' 
  AND tm.status = 'active'
  LIMIT 1;
  
  RETURN email_address;
END;
$$;

-- Add RLS policies for inbox_emails
DROP POLICY IF EXISTS "Users can manage own inbox emails" ON public.inbox_emails;
DROP POLICY IF EXISTS "Company members can view company inbox emails" ON public.inbox_emails;

CREATE POLICY "Company members can view company inbox emails" ON public.inbox_emails
  FOR SELECT USING (
    user_id IN (
      SELECT tm.user_id 
      FROM public.team_members tm 
      JOIN public.profiles p ON tm.user_id = p.id
      WHERE tm.company_id = p.company_id 
      AND tm.status = 'active'
      AND p.id = auth.uid()
    )
  );

CREATE POLICY "Company members can manage company inbox emails" ON public.inbox_emails
  FOR ALL USING (
    user_id IN (
      SELECT tm.user_id 
      FROM public.team_members tm 
      JOIN public.profiles p ON tm.user_id = p.id
      WHERE tm.company_id = p.company_id 
      AND tm.status = 'active'
      AND p.id = auth.uid()
    )
  );
