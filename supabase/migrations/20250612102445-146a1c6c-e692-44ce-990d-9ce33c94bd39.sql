
-- Add RLS policies for inbox_emails table
ALTER TABLE public.inbox_emails ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own inbox emails
CREATE POLICY "Users can view their own inbox emails" 
  ON public.inbox_emails 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own inbox emails
CREATE POLICY "Users can create their own inbox emails" 
  ON public.inbox_emails 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own inbox emails
CREATE POLICY "Users can update their own inbox emails" 
  ON public.inbox_emails 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to delete their own inbox emails
CREATE POLICY "Users can delete their own inbox emails" 
  ON public.inbox_emails 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for inbox_messages table
ALTER TABLE public.inbox_messages ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own inbox messages
CREATE POLICY "Users can view their own inbox messages" 
  ON public.inbox_messages 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own inbox messages
CREATE POLICY "Users can create their own inbox messages" 
  ON public.inbox_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own inbox messages
CREATE POLICY "Users can update their own inbox messages" 
  ON public.inbox_messages 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to delete their own inbox messages
CREATE POLICY "Users can delete their own inbox messages" 
  ON public.inbox_messages 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Allow service role to insert messages from webhook (bypasses RLS)
-- This is needed for the Mailgun webhook to insert messages
CREATE POLICY "Service role can insert inbox messages" 
  ON public.inbox_messages 
  FOR INSERT 
  TO service_role
  WITH CHECK (true);
