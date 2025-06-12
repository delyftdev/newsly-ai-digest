
-- First, let's ensure we have a way to link inbox messages to companies
-- Add company_id to inbox_messages table for direct company association
ALTER TABLE public.inbox_messages 
ADD COLUMN company_id uuid REFERENCES public.companies(id);

-- Create index for better performance on company-based queries
CREATE INDEX idx_inbox_messages_company_id ON public.inbox_messages(company_id);

-- Update RLS policies to allow company-based access
DROP POLICY IF EXISTS "Users can view their own inbox messages" ON public.inbox_messages;
DROP POLICY IF EXISTS "Users can create their own inbox messages" ON public.inbox_messages;
DROP POLICY IF EXISTS "Users can update their own inbox messages" ON public.inbox_messages;
DROP POLICY IF EXISTS "Users can delete their own inbox messages" ON public.inbox_messages;

-- Create new company-based RLS policies
CREATE POLICY "Company members can view company inbox messages" 
  ON public.inbox_messages 
  FOR SELECT 
  USING (
    company_id IN (
      SELECT tm.company_id 
      FROM public.team_members tm 
      WHERE tm.user_id = auth.uid() 
      AND tm.status = 'active'
    )
  );

CREATE POLICY "Company members can create company inbox messages" 
  ON public.inbox_messages 
  FOR INSERT 
  WITH CHECK (
    company_id IN (
      SELECT tm.company_id 
      FROM public.team_members tm 
      WHERE tm.user_id = auth.uid() 
      AND tm.status = 'active'
    )
  );

CREATE POLICY "Company members can update company inbox messages" 
  ON public.inbox_messages 
  FOR UPDATE 
  USING (
    company_id IN (
      SELECT tm.company_id 
      FROM public.team_members tm 
      WHERE tm.user_id = auth.uid() 
      AND tm.status = 'active'
    )
  );

CREATE POLICY "Company members can delete company inbox messages" 
  ON public.inbox_messages 
  FOR DELETE 
  USING (
    company_id IN (
      SELECT tm.company_id 
      FROM public.team_members tm 
      WHERE tm.user_id = auth.uid() 
      AND tm.status = 'active'
    )
  );

-- Keep the service role policy for webhook access
-- (This was already created in the previous migration)
