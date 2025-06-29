
-- Create feedback_ideas table
CREATE TABLE public.feedback_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'under-review',
  vote_count INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'improvement',
  tags TEXT[] DEFAULT '{}',
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feedback_votes table to track user votes
CREATE TABLE public.feedback_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_id UUID NOT NULL REFERENCES public.feedback_ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(feedback_id, user_id)
);

-- Create feedback_comments table for discussions
CREATE TABLE public.feedback_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_id UUID NOT NULL REFERENCES public.feedback_ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feedback_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feedback_ideas
CREATE POLICY "Users can view feedback ideas from their company" 
  ON public.feedback_ideas 
  FOR SELECT 
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can create feedback ideas for their company" 
  ON public.feedback_ideas 
  FOR INSERT 
  WITH CHECK (company_id = get_user_company_id() AND user_id = auth.uid());

CREATE POLICY "Users can update their own feedback ideas" 
  ON public.feedback_ideas 
  FOR UPDATE 
  USING (user_id = auth.uid() AND company_id = get_user_company_id());

CREATE POLICY "Users can delete their own feedback ideas" 
  ON public.feedback_ideas 
  FOR DELETE 
  USING (user_id = auth.uid() AND company_id = get_user_company_id());

-- RLS Policies for feedback_votes
CREATE POLICY "Users can view votes from their company feedback" 
  ON public.feedback_votes 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.feedback_ideas 
    WHERE id = feedback_id AND company_id = get_user_company_id()
  ));

CREATE POLICY "Users can create votes for their company feedback" 
  ON public.feedback_votes 
  FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.feedback_ideas 
      WHERE id = feedback_id AND company_id = get_user_company_id()
    )
  );

CREATE POLICY "Users can delete their own votes" 
  ON public.feedback_votes 
  FOR DELETE 
  USING (user_id = auth.uid());

-- RLS Policies for feedback_comments
CREATE POLICY "Users can view comments from their company feedback" 
  ON public.feedback_comments 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.feedback_ideas 
    WHERE id = feedback_id AND company_id = get_user_company_id()
  ));

CREATE POLICY "Users can create comments for their company feedback" 
  ON public.feedback_comments 
  FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.feedback_ideas 
      WHERE id = feedback_id AND company_id = get_user_company_id()
    )
  );

CREATE POLICY "Users can update their own comments" 
  ON public.feedback_comments 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments" 
  ON public.feedback_comments 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Create function to update vote count
CREATE OR REPLACE FUNCTION update_feedback_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.feedback_ideas 
    SET vote_count = vote_count + 1, updated_at = now()
    WHERE id = NEW.feedback_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.feedback_ideas 
    SET vote_count = vote_count - 1, updated_at = now()
    WHERE id = OLD.feedback_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update vote count
CREATE TRIGGER feedback_vote_count_trigger
  AFTER INSERT OR DELETE ON public.feedback_votes
  FOR EACH ROW EXECUTE FUNCTION update_feedback_vote_count();

-- Enable realtime for feedback tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback_ideas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback_comments;
