
-- Create announcement analytics table to track views, engagement, and performance
CREATE TABLE public.announcement_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  announcement_id UUID NOT NULL,
  announcement_type TEXT NOT NULL DEFAULT 'changelog', -- 'changelog' or 'release'
  user_id UUID REFERENCES auth.users,
  session_id TEXT,
  event_type TEXT NOT NULL, -- 'view', 'time_spent', 'email_open', 'link_click'
  event_data JSONB DEFAULT '{}',
  source TEXT DEFAULT 'direct', -- 'email', 'website', 'direct', 'social'
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create announcement reactions table for engagement tracking
CREATE TABLE public.announcement_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  announcement_id UUID NOT NULL,
  announcement_type TEXT NOT NULL DEFAULT 'changelog',
  user_id UUID REFERENCES auth.users,
  reaction_type TEXT NOT NULL DEFAULT 'like', -- 'like', 'love', 'helpful', 'confused'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(announcement_id, announcement_type, user_id, reaction_type)
);

-- Add analytics fields to changelogs table
ALTER TABLE public.changelogs 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS unique_views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reaction_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_time_spent NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS email_open_rate NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS click_through_rate NUMERIC DEFAULT 0;

-- Add analytics fields to releases table
ALTER TABLE public.releases 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS unique_views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reaction_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_time_spent NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS email_open_rate NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS click_through_rate NUMERIC DEFAULT 0;

-- Enable RLS for announcement analytics
ALTER TABLE public.announcement_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_reactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for announcement analytics (company-based access)
CREATE POLICY "Company members can view announcement analytics" 
  ON public.announcement_analytics 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      JOIN public.team_members tm ON p.id = tm.user_id 
      WHERE p.id = auth.uid() AND tm.status = 'active'
    )
  );

CREATE POLICY "Anyone can insert analytics events" 
  ON public.announcement_analytics 
  FOR INSERT 
  WITH CHECK (true);

-- Create RLS policies for announcement reactions
CREATE POLICY "Users can view all reactions" 
  ON public.announcement_reactions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage their own reactions" 
  ON public.announcement_reactions 
  FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_announcement_analytics_announcement ON public.announcement_analytics(announcement_id, announcement_type);
CREATE INDEX idx_announcement_analytics_event_type ON public.announcement_analytics(event_type);
CREATE INDEX idx_announcement_analytics_created_at ON public.announcement_analytics(created_at);
CREATE INDEX idx_announcement_reactions_announcement ON public.announcement_reactions(announcement_id, announcement_type);

-- Create function to update announcement stats
CREATE OR REPLACE FUNCTION update_announcement_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update view counts for changelogs
  IF NEW.announcement_type = 'changelog' AND NEW.event_type = 'view' THEN
    UPDATE public.changelogs 
    SET view_count = view_count + 1,
        unique_views = (
          SELECT COUNT(DISTINCT COALESCE(user_id::text, session_id))
          FROM public.announcement_analytics 
          WHERE announcement_id = NEW.announcement_id 
          AND announcement_type = 'changelog'
          AND event_type = 'view'
        )
    WHERE id = NEW.announcement_id;
  END IF;

  -- Update view counts for releases
  IF NEW.announcement_type = 'release' AND NEW.event_type = 'view' THEN
    UPDATE public.releases 
    SET view_count = view_count + 1,
        unique_views = (
          SELECT COUNT(DISTINCT COALESCE(user_id::text, session_id))
          FROM public.announcement_analytics 
          WHERE announcement_id = NEW.announcement_id 
          AND announcement_type = 'release'
          AND event_type = 'view'
        )
    WHERE id = NEW.announcement_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating stats
CREATE TRIGGER update_announcement_stats_trigger
  AFTER INSERT ON public.announcement_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_announcement_stats();

-- Create function to update reaction counts
CREATE OR REPLACE FUNCTION update_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update reaction count for changelogs
    IF NEW.announcement_type = 'changelog' THEN
      UPDATE public.changelogs 
      SET reaction_count = (
        SELECT COUNT(*) FROM public.announcement_reactions 
        WHERE announcement_id = NEW.announcement_id AND announcement_type = 'changelog'
      )
      WHERE id = NEW.announcement_id;
    END IF;

    -- Update reaction count for releases
    IF NEW.announcement_type = 'release' THEN
      UPDATE public.releases 
      SET reaction_count = (
        SELECT COUNT(*) FROM public.announcement_reactions 
        WHERE announcement_id = NEW.announcement_id AND announcement_type = 'release'
      )
      WHERE id = NEW.announcement_id;
    END IF;

    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    -- Update reaction count for changelogs
    IF OLD.announcement_type = 'changelog' THEN
      UPDATE public.changelogs 
      SET reaction_count = (
        SELECT COUNT(*) FROM public.announcement_reactions 
        WHERE announcement_id = OLD.announcement_id AND announcement_type = 'changelog'
      )
      WHERE id = OLD.announcement_id;
    END IF;

    -- Update reaction count for releases
    IF OLD.announcement_type = 'release' THEN
      UPDATE public.releases 
      SET reaction_count = (
        SELECT COUNT(*) FROM public.announcement_reactions 
        WHERE announcement_id = OLD.announcement_id AND announcement_type = 'release'
      )
      WHERE id = OLD.announcement_id;
    END IF;

    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating reaction counts
CREATE TRIGGER update_reaction_counts_trigger
  AFTER INSERT OR DELETE ON public.announcement_reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_reaction_counts();
