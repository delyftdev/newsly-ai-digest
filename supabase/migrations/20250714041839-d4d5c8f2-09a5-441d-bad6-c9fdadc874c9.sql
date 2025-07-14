
-- Create changelog participants table
CREATE TABLE public.changelog_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  changelog_id UUID NOT NULL REFERENCES public.changelogs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'collaborator',
  invited_by UUID NOT NULL,
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(changelog_id, user_id)
);

-- Create changelog comments table
CREATE TABLE public.changelog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  changelog_id UUID NOT NULL REFERENCES public.changelogs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  parent_comment_id UUID REFERENCES public.changelog_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  position_data JSONB, -- Store cursor position/text selection data
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create approval chains configuration table
CREATE TABLE public.approval_chains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  chain_config JSONB NOT NULL, -- Store approval steps and configuration
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create changelog approvals table
CREATE TABLE public.changelog_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  changelog_id UUID NOT NULL REFERENCES public.changelogs(id) ON DELETE CASCADE,
  approval_chain_id UUID REFERENCES public.approval_chains(id),
  current_step INTEGER NOT NULL DEFAULT 1,
  total_steps INTEGER NOT NULL,
  approver_user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  decision_notes TEXT,
  decided_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create changelog activity table for timeline tracking
CREATE TABLE public.changelog_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  changelog_id UUID NOT NULL REFERENCES public.changelogs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL, -- created, commented, approved, rejected, published, etc.
  activity_data JSONB, -- Store additional context data
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all new tables
ALTER TABLE public.changelog_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.changelog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.changelog_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.changelog_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for changelog_participants
CREATE POLICY "Users can view participants of company changelogs" 
  ON public.changelog_participants 
  FOR SELECT 
  USING (
    changelog_id IN (
      SELECT c.id FROM public.changelogs c
      JOIN public.team_members tm ON c.company_id = tm.company_id
      WHERE tm.user_id = auth.uid() AND tm.status = 'active'
    )
  );

CREATE POLICY "Users can manage participants of company changelogs" 
  ON public.changelog_participants 
  FOR ALL 
  USING (
    changelog_id IN (
      SELECT c.id FROM public.changelogs c
      JOIN public.team_members tm ON c.company_id = tm.company_id
      WHERE tm.user_id = auth.uid() AND tm.status = 'active'
    )
  );

-- RLS Policies for changelog_comments
CREATE POLICY "Users can view comments on company changelogs" 
  ON public.changelog_comments 
  FOR SELECT 
  USING (
    changelog_id IN (
      SELECT c.id FROM public.changelogs c
      JOIN public.team_members tm ON c.company_id = tm.company_id
      WHERE tm.user_id = auth.uid() AND tm.status = 'active'
    )
  );

CREATE POLICY "Users can create comments on company changelogs" 
  ON public.changelog_comments 
  FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() AND
    changelog_id IN (
      SELECT c.id FROM public.changelogs c
      JOIN public.team_members tm ON c.company_id = tm.company_id
      WHERE tm.user_id = auth.uid() AND tm.status = 'active'
    )
  );

CREATE POLICY "Users can update their own comments" 
  ON public.changelog_comments 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- RLS Policies for approval_chains
CREATE POLICY "Users can view company approval chains" 
  ON public.approval_chains 
  FOR SELECT 
  USING (
    company_id IN (
      SELECT tm.company_id FROM public.team_members tm
      WHERE tm.user_id = auth.uid() AND tm.status = 'active'
    )
  );

CREATE POLICY "Admins can manage company approval chains" 
  ON public.approval_chains 
  FOR ALL 
  USING (
    company_id IN (
      SELECT tm.company_id FROM public.team_members tm
      WHERE tm.user_id = auth.uid() AND tm.status = 'active' AND tm.role = 'admin'
    )
  );

-- RLS Policies for changelog_approvals
CREATE POLICY "Users can view approvals for company changelogs" 
  ON public.changelog_approvals 
  FOR SELECT 
  USING (
    changelog_id IN (
      SELECT c.id FROM public.changelogs c
      JOIN public.team_members tm ON c.company_id = tm.company_id
      WHERE tm.user_id = auth.uid() AND tm.status = 'active'
    )
  );

CREATE POLICY "Users can manage approvals for company changelogs" 
  ON public.changelog_approvals 
  FOR ALL 
  USING (
    changelog_id IN (
      SELECT c.id FROM public.changelogs c
      JOIN public.team_members tm ON c.company_id = tm.company_id
      WHERE tm.user_id = auth.uid() AND tm.status = 'active'
    )
  );

-- RLS Policies for changelog_activity
CREATE POLICY "Users can view activity for company changelogs" 
  ON public.changelog_activity 
  FOR SELECT 
  USING (
    changelog_id IN (
      SELECT c.id FROM public.changelogs c
      JOIN public.team_members tm ON c.company_id = tm.company_id
      WHERE tm.user_id = auth.uid() AND tm.status = 'active'
    )
  );

CREATE POLICY "Users can create activity for company changelogs" 
  ON public.changelog_activity 
  FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() AND
    changelog_id IN (
      SELECT c.id FROM public.changelogs c
      JOIN public.team_members tm ON c.company_id = tm.company_id
      WHERE tm.user_id = auth.uid() AND tm.status = 'active'
    )
  );

-- Enable realtime for new tables
ALTER TABLE public.changelog_participants REPLICA IDENTITY FULL;
ALTER TABLE public.changelog_comments REPLICA IDENTITY FULL;
ALTER TABLE public.changelog_approvals REPLICA IDENTITY FULL;
ALTER TABLE public.changelog_activity REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.changelog_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.changelog_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.changelog_approvals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.changelog_activity;

-- Create indexes for better performance
CREATE INDEX idx_changelog_participants_changelog_id ON public.changelog_participants(changelog_id);
CREATE INDEX idx_changelog_participants_user_id ON public.changelog_participants(user_id);
CREATE INDEX idx_changelog_comments_changelog_id ON public.changelog_comments(changelog_id);
CREATE INDEX idx_changelog_comments_parent_id ON public.changelog_comments(parent_comment_id);
CREATE INDEX idx_changelog_approvals_changelog_id ON public.changelog_approvals(changelog_id);
CREATE INDEX idx_changelog_activity_changelog_id ON public.changelog_activity(changelog_id);
