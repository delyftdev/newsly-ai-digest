
-- Comprehensive Fix Migration - Clean up and establish proper data relationships

-- Step 1: Clean up any orphaned or inconsistent data
DELETE FROM public.inbox_emails WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.team_members WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.profiles WHERE id NOT IN (SELECT id FROM auth.users);

-- Step 2: Ensure all users have proper profiles with company_id
INSERT INTO public.profiles (id, full_name, created_at, updated_at)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  NOW(),
  NOW()
FROM auth.users au
WHERE au.id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Create companies for users who don't have them
WITH users_without_companies AS (
  SELECT p.id as user_id, p.full_name
  FROM public.profiles p
  LEFT JOIN public.team_members tm ON tm.user_id = p.id AND tm.status = 'active'
  WHERE tm.company_id IS NULL AND p.company_id IS NULL
),
new_companies AS (
  INSERT INTO public.companies (name, subdomain, created_at, updated_at)
  SELECT 
    COALESCE(uwc.full_name || '''s Company', 'My Company'),
    'company-' || substr(md5(random()::text || uwc.user_id::text), 1, 12),
    NOW(),
    NOW()
  FROM users_without_companies uwc
  RETURNING id, name
)
INSERT INTO public.team_members (company_id, user_id, role, status, joined_at)
SELECT nc.id, uwc.user_id, 'admin', 'active', NOW()
FROM new_companies nc, users_without_companies uwc;

-- Step 4: Update profiles with correct company_id from team_members
UPDATE public.profiles 
SET company_id = tm.company_id, updated_at = NOW()
FROM public.team_members tm
WHERE profiles.id = tm.user_id 
AND tm.status = 'active' 
AND profiles.company_id IS NULL;

-- Step 5: Create default branding for all companies
INSERT INTO public.branding (company_id, primary_color, secondary_color, font_family)
SELECT c.id, '#3B82F6', '#6B7280', 'Inter'
FROM public.companies c
WHERE c.id NOT IN (SELECT company_id FROM public.branding WHERE company_id IS NOT NULL)
ON CONFLICT DO NOTHING;

-- Step 6: Generate inbox emails for all companies using new format
WITH companies_without_emails AS (
  SELECT DISTINCT c.id as company_id, c.subdomain, tm.user_id
  FROM public.companies c
  JOIN public.team_members tm ON tm.company_id = c.id
  WHERE tm.role = 'admin' 
  AND tm.status = 'active'
  AND c.id NOT IN (
    SELECT DISTINCT tm2.company_id 
    FROM public.team_members tm2 
    JOIN public.inbox_emails ie ON ie.user_id = tm2.user_id 
    WHERE tm2.status = 'active'
  )
)
INSERT INTO public.inbox_emails (user_id, email_address, created_at, updated_at)
SELECT 
  cwoe.user_id,
  'app-' || cwoe.subdomain || '-' || substr(md5(random()::text), 1, 8) || '@sandboxbb958968707c47d289a60ae9b53aff0f.mailgun.org',
  NOW(),
  NOW()
FROM companies_without_emails cwoe;

-- Step 7: Create upsert functions for settings management

-- Upsert function for companies
CREATE OR REPLACE FUNCTION public.upsert_company_info(
  user_uuid UUID,
  company_name TEXT DEFAULT NULL,
  company_domain TEXT DEFAULT NULL,
  company_team_size TEXT DEFAULT NULL,
  company_industry TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_company_id UUID;
  result JSON;
BEGIN
  -- Get user's company_id
  SELECT p.company_id INTO target_company_id
  FROM public.profiles p
  WHERE p.id = user_uuid;
  
  -- If no company exists, create one
  IF target_company_id IS NULL THEN
    INSERT INTO public.companies (name, subdomain, created_at, updated_at)
    VALUES (
      COALESCE(company_name, 'My Company'),
      'company-' || substr(md5(random()::text || user_uuid::text), 1, 12),
      NOW(),
      NOW()
    )
    RETURNING id INTO target_company_id;
    
    -- Create team member record
    INSERT INTO public.team_members (company_id, user_id, role, status, joined_at)
    VALUES (target_company_id, user_uuid, 'admin', 'active', NOW());
    
    -- Update profile with company_id
    UPDATE public.profiles 
    SET company_id = target_company_id, updated_at = NOW()
    WHERE id = user_uuid;
  END IF;
  
  -- Update company info
  UPDATE public.companies 
  SET 
    name = COALESCE(company_name, name),
    domain = COALESCE(company_domain, domain),
    team_size = COALESCE(company_team_size, team_size),
    industry = COALESCE(company_industry, industry),
    updated_at = NOW()
  WHERE id = target_company_id;
  
  -- Return success
  SELECT json_build_object(
    'success', true,
    'company_id', target_company_id,
    'message', 'Company information updated successfully'
  ) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Upsert function for profiles
CREATE OR REPLACE FUNCTION public.upsert_profile_info(
  user_uuid UUID,
  user_full_name TEXT DEFAULT NULL,
  user_role TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Upsert profile
  INSERT INTO public.profiles (id, full_name, role, updated_at)
  VALUES (user_uuid, user_full_name, user_role, NOW())
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    role = COALESCE(EXCLUDED.role, profiles.role),
    updated_at = NOW();
  
  -- Return success
  SELECT json_build_object(
    'success', true,
    'message', 'Profile updated successfully'
  ) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Upsert function for branding
CREATE OR REPLACE FUNCTION public.upsert_branding_info(
  user_uuid UUID,
  brand_primary_color TEXT DEFAULT NULL,
  brand_secondary_color TEXT DEFAULT NULL,
  brand_font_family TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_company_id UUID;
  result JSON;
BEGIN
  -- Get user's company_id
  SELECT p.company_id INTO target_company_id
  FROM public.profiles p
  WHERE p.id = user_uuid;
  
  IF target_company_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'No company found for user'
    );
  END IF;
  
  -- Upsert branding
  INSERT INTO public.branding (company_id, primary_color, secondary_color, font_family)
  VALUES (target_company_id, brand_primary_color, brand_secondary_color, brand_font_family)
  ON CONFLICT (company_id) DO UPDATE SET
    primary_color = COALESCE(EXCLUDED.primary_color, branding.primary_color),
    secondary_color = COALESCE(EXCLUDED.secondary_color, branding.secondary_color),
    font_family = COALESCE(EXCLUDED.font_family, branding.font_family);
  
  -- Return success
  SELECT json_build_object(
    'success', true,
    'message', 'Branding updated successfully'
  ) INTO result;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;
