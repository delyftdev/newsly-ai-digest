
-- Create changelogs table
CREATE TABLE public.changelogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  title TEXT NOT NULL,
  content JSONB DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'announcement',
  status TEXT NOT NULL DEFAULT 'draft',
  visibility TEXT NOT NULL DEFAULT 'public',
  featured_image_url TEXT,
  video_url TEXT,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMP WITH TIME ZONE,
  published_by UUID,
  public_slug TEXT UNIQUE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ai_generated BOOLEAN DEFAULT false,
  auto_saved_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on changelogs table
ALTER TABLE public.changelogs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for changelogs
CREATE POLICY "Users can view their company changelogs" 
  ON public.changelogs 
  FOR SELECT 
  USING (
    company_id IN (
      SELECT tm.company_id 
      FROM public.team_members tm 
      WHERE tm.user_id = auth.uid() 
      AND tm.status = 'active'
    )
  );

CREATE POLICY "Users can create changelogs for their company" 
  ON public.changelogs 
  FOR INSERT 
  WITH CHECK (
    company_id IN (
      SELECT tm.company_id 
      FROM public.team_members tm 
      WHERE tm.user_id = auth.uid() 
      AND tm.status = 'active'
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "Users can update their company changelogs" 
  ON public.changelogs 
  FOR UPDATE 
  USING (
    company_id IN (
      SELECT tm.company_id 
      FROM public.team_members tm 
      WHERE tm.user_id = auth.uid() 
      AND tm.status = 'active'
    )
  );

CREATE POLICY "Users can delete their company changelogs" 
  ON public.changelogs 
  FOR DELETE 
  USING (
    company_id IN (
      SELECT tm.company_id 
      FROM public.team_members tm 
      WHERE tm.user_id = auth.uid() 
      AND tm.status = 'active'
    )
  );

-- Create policy for public access to published changelogs
CREATE POLICY "Public can view published changelogs" 
  ON public.changelogs 
  FOR SELECT 
  USING (status = 'published' AND visibility = 'public');

-- Create function to generate unique slug
CREATE OR REPLACE FUNCTION generate_changelog_slug(title TEXT, company_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Generate base slug from title
  base_slug := lower(regexp_replace(trim(title), '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := left(base_slug, 50);
  
  final_slug := base_slug;
  
  -- Check if slug exists and append counter if needed
  WHILE EXISTS (SELECT 1 FROM public.changelogs WHERE public_slug = final_slug AND changelogs.company_id = generate_changelog_slug.company_id) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$;
