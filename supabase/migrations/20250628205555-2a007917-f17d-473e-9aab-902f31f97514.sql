
-- Drop the problematic RLS policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view team members of their companies" ON public.team_members;
DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;

-- Create a security definer function to safely get user's company ID from team_members
CREATE OR REPLACE FUNCTION public.get_user_company_from_team_members(user_uuid uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT company_id FROM public.team_members WHERE user_id = user_uuid AND status = 'active' LIMIT 1;
$$;

-- Create new RLS policies that don't cause recursion
CREATE POLICY "Team members can view company team members" 
  ON public.team_members 
  FOR SELECT 
  USING (
    company_id = public.get_user_company_from_team_members(auth.uid())
  );

CREATE POLICY "Team members can insert team records" 
  ON public.team_members 
  FOR INSERT 
  WITH CHECK (
    company_id = public.get_user_company_from_team_members(auth.uid())
  );

CREATE POLICY "Team members can update team records" 
  ON public.team_members 
  FOR UPDATE 
  USING (
    company_id = public.get_user_company_from_team_members(auth.uid())
  );

CREATE POLICY "Team members can delete team records" 
  ON public.team_members 
  FOR DELETE 
  USING (
    company_id = public.get_user_company_from_team_members(auth.uid())
  );
