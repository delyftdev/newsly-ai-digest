
-- Allow public access to company basic info for public pages
CREATE POLICY "Allow public access to company info" ON public.companies
  FOR SELECT 
  USING (true);

-- Allow public access to published changelogs
CREATE POLICY "Allow public access to published changelogs" ON public.changelogs
  FOR SELECT 
  USING (status = 'published' AND visibility = 'public');

-- Allow public access to feedback ideas for public feedback portal
CREATE POLICY "Allow public access to feedback ideas" ON public.feedback_ideas
  FOR SELECT 
  USING (NOT is_private);
