
-- Phase 1: Fix Database Function Issues and RLS Policies

-- First, fix the ensure_company_inbox_email function to bypass RLS and handle all cases properly
CREATE OR REPLACE FUNCTION public.ensure_company_inbox_email(company_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  company_subdomain TEXT;
  email_address TEXT;
  existing_email TEXT;
  admin_user_id UUID;
BEGIN
  -- Get company subdomain
  SELECT subdomain INTO company_subdomain 
  FROM public.companies 
  WHERE id = company_uuid;
  
  IF company_subdomain IS NULL THEN
    RAISE NOTICE 'Company not found for UUID: %', company_uuid;
    RETURN NULL;
  END IF;
  
  RAISE NOTICE 'Processing company with subdomain: %', company_subdomain;
  
  -- Check if company already has an inbox email (bypass RLS by using security definer)
  SELECT ie.email_address INTO existing_email
  FROM public.inbox_emails ie
  WHERE ie.user_id IN (
    SELECT tm.user_id 
    FROM public.team_members tm 
    WHERE tm.company_id = company_uuid 
    AND tm.status = 'active'
  )
  LIMIT 1;
  
  IF existing_email IS NOT NULL THEN
    RAISE NOTICE 'Found existing email: %', existing_email;
    RETURN existing_email;
  END IF;
  
  -- Find the first admin user of the company
  SELECT tm.user_id INTO admin_user_id
  FROM public.team_members tm
  WHERE tm.company_id = company_uuid 
  AND tm.role = 'admin' 
  AND tm.status = 'active'
  LIMIT 1;
  
  IF admin_user_id IS NULL THEN
    RAISE NOTICE 'No admin user found for company: %', company_uuid;
    RETURN NULL;
  END IF;
  
  -- Generate new email address with consistent format
  email_address := 'app-' || company_subdomain || '-' || substr(md5(random()::text), 1, 8) || '@sandboxbb958968707c47d289a60ae9b53aff0f.mailgun.org';
  
  RAISE NOTICE 'Generated email address: %', email_address;
  
  -- Create inbox email
  INSERT INTO public.inbox_emails (user_id, email_address, created_at, updated_at)
  VALUES (admin_user_id, email_address, NOW(), NOW());
  
  RAISE NOTICE 'Successfully created inbox email for user: %', admin_user_id;
  
  RETURN email_address;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in ensure_company_inbox_email: %', SQLERRM;
    RETURN NULL;
END;
$$;

-- Fix RLS policies for inbox_emails to be more permissive for company members
DROP POLICY IF EXISTS "Company members can view company inbox emails" ON public.inbox_emails;
DROP POLICY IF EXISTS "Company members can manage company inbox emails" ON public.inbox_emails;

-- Create more permissive policies
CREATE POLICY "Company members can view company inbox emails" ON public.inbox_emails
  FOR SELECT USING (
    EXISTS (
      SELECT 1 
      FROM public.profiles p
      JOIN public.team_members tm ON tm.user_id = p.id
      WHERE p.id = auth.uid()
      AND tm.company_id = p.company_id
      AND tm.status = 'active'
      AND EXISTS (
        SELECT 1 
        FROM public.profiles p2 
        WHERE p2.id = inbox_emails.user_id 
        AND p2.company_id = p.company_id
      )
    )
  );

CREATE POLICY "Company members can manage company inbox emails" ON public.inbox_emails
  FOR ALL USING (
    EXISTS (
      SELECT 1 
      FROM public.profiles p
      JOIN public.team_members tm ON tm.user_id = p.id
      WHERE p.id = auth.uid()
      AND tm.company_id = p.company_id
      AND tm.status = 'active'
      AND EXISTS (
        SELECT 1 
        FROM public.profiles p2 
        WHERE p2.id = inbox_emails.user_id 
        AND p2.company_id = p.company_id
      )
    )
  );

-- Enable RLS on inbox_emails if not already enabled
ALTER TABLE public.inbox_emails ENABLE ROW LEVEL SECURITY;

-- Fix RLS policies for inbox_messages to ensure company-based access
DROP POLICY IF EXISTS "Company members can view company messages" ON public.inbox_messages;
DROP POLICY IF EXISTS "Company members can manage company messages" ON public.inbox_messages;

CREATE POLICY "Company members can view company messages" ON public.inbox_messages
  FOR SELECT USING (
    company_id IN (
      SELECT p.company_id 
      FROM public.profiles p
      JOIN public.team_members tm ON tm.user_id = p.id
      WHERE p.id = auth.uid()
      AND tm.company_id = p.company_id
      AND tm.status = 'active'
    )
  );

CREATE POLICY "Company members can manage company messages" ON public.inbox_messages
  FOR ALL USING (
    company_id IN (
      SELECT p.company_id 
      FROM public.profiles p
      JOIN public.team_members tm ON tm.user_id = p.id
      WHERE p.id = auth.uid()
      AND tm.company_id = p.company_id
      AND tm.status = 'active'
    )
  );

-- Enable RLS on inbox_messages if not already enabled
ALTER TABLE public.inbox_messages ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for companies table
DROP POLICY IF EXISTS "Company members can view their company" ON public.companies;
DROP POLICY IF EXISTS "Company members can update their company" ON public.companies;

CREATE POLICY "Company members can view their company" ON public.companies
  FOR SELECT USING (
    id IN (
      SELECT p.company_id 
      FROM public.profiles p
      JOIN public.team_members tm ON tm.user_id = p.id
      WHERE p.id = auth.uid()
      AND tm.company_id = p.company_id
      AND tm.status = 'active'
    )
  );

CREATE POLICY "Company members can update their company" ON public.companies
  FOR UPDATE USING (
    id IN (
      SELECT p.company_id 
      FROM public.profiles p
      JOIN public.team_members tm ON tm.user_id = p.id
      WHERE p.id = auth.uid()
      AND tm.company_id = p.company_id
      AND tm.status = 'active'
      AND tm.role IN ('admin', 'editor')
    )
  );

-- Enable RLS on companies if not already enabled
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for branding table
DROP POLICY IF EXISTS "Company members can view branding" ON public.branding;
DROP POLICY IF EXISTS "Company members can update branding" ON public.branding;

CREATE POLICY "Company members can view branding" ON public.branding
  FOR SELECT USING (
    company_id IN (
      SELECT p.company_id 
      FROM public.profiles p
      JOIN public.team_members tm ON tm.user_id = p.id
      WHERE p.id = auth.uid()
      AND tm.company_id = p.company_id
      AND tm.status = 'active'
    )
  );

CREATE POLICY "Company members can manage branding" ON public.branding
  FOR ALL USING (
    company_id IN (
      SELECT p.company_id 
      FROM public.profiles p
      JOIN public.team_members tm ON tm.user_id = p.id
      WHERE p.id = auth.uid()
      AND tm.company_id = p.company_id
      AND tm.status = 'active'
      AND tm.role IN ('admin', 'editor')
    )
  );

-- Enable RLS on branding if not already enabled
ALTER TABLE public.branding ENABLE ROW LEVEL SECURITY;
