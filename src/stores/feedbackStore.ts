
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface FeedbackIdea {
  id: string;
  company_id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  vote_count: number;
  category: string;
  tags: string[];
  is_private: boolean;
  created_at: string;
  updated_at: string;
  user_has_voted?: boolean;
}

export interface FeedbackVote {
  id: string;
  feedback_id: string;
  user_id: string;
  created_at: string;
}

interface FeedbackStore {
  ideas: FeedbackIdea[];
  isLoading: boolean;
  error: string | null;
  sortBy: 'trending' | 'new' | 'top';
  filterBy: string;
  
  // Actions
  fetchIdeas: () => Promise<void>;
  createIdea: (idea: Omit<FeedbackIdea, 'id' | 'company_id' | 'user_id' | 'vote_count' | 'created_at' | 'updated_at'>) => Promise<void>;
  voteIdea: (ideaId: string) => Promise<void>;
  unvoteIdea: (ideaId: string) => Promise<void>;
  updateIdeaStatus: (ideaId: string, status: string) => Promise<void>;
  setSortBy: (sort: 'trending' | 'new' | 'top') => void;
  setFilterBy: (filter: string) => void;
}

export const useFeedbackStore = create<FeedbackStore>((set, get) => ({
  ideas: [],
  isLoading: false,
  error: null,
  sortBy: 'trending',
  filterBy: 'all',

  fetchIdeas: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error(`Authentication error: ${userError.message}`);
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get user's company
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        throw new Error(`Profile error: ${profileError.message}`);
      }
      
      if (!profile?.company_id) {
        throw new Error('No company found for user');
      }

      // Fetch ideas with user vote status
      const { data: ideas, error: ideasError } = await supabase
        .from('feedback_ideas')
        .select(`
          *,
          feedback_votes!left(user_id)
        `)
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false });

      if (ideasError) throw ideasError;

      // Process ideas to include user vote status
      const processedIdeas = ideas?.map(idea => ({
        ...idea,
        user_has_voted: idea.feedback_votes?.some((vote: any) => vote.user_id === user.id) || false,
        feedback_votes: undefined // Remove the votes array from final object
      })) || [];

      set({ ideas: processedIdeas, isLoading: false });
    } catch (error) {
      console.error('Error fetching ideas:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createIdea: async (ideaData) => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error(`Authentication error: ${userError.message}`);
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get user's company
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        throw new Error(`Profile error: ${profileError.message}`);
      }
      
      if (!profile?.company_id) {
        throw new Error('No company found for user');
      }

      const { data, error } = await supabase
        .from('feedback_ideas')
        .insert({
          ...ideaData,
          company_id: profile.company_id,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Add the new idea to the store
      set(state => ({
        ideas: [{ ...data, user_has_voted: false }, ...state.ideas]
      }));
    } catch (error) {
      console.error('Error creating idea:', error);
      set({ error: (error as Error).message });
    }
  },

  voteIdea: async (ideaId) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('feedback_votes')
        .insert({
          feedback_id: ideaId,
          user_id: user.id
        });

      if (error) throw error;

      // Update local state optimistically
      set(state => ({
        ideas: state.ideas.map(idea =>
          idea.id === ideaId
            ? { ...idea, vote_count: idea.vote_count + 1, user_has_voted: true }
            : idea
        )
      }));
    } catch (error) {
      console.error('Error voting idea:', error);
      set({ error: (error as Error).message });
    }
  },

  unvoteIdea: async (ideaId) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('feedback_votes')
        .delete()
        .eq('feedback_id', ideaId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state optimistically
      set(state => ({
        ideas: state.ideas.map(idea =>
          idea.id === ideaId
            ? { ...idea, vote_count: idea.vote_count - 1, user_has_voted: false }
            : idea
        )
      }));
    } catch (error) {
      console.error('Error unvoting idea:', error);
      set({ error: (error as Error).message });
    }
  },

  updateIdeaStatus: async (ideaId, status) => {
    try {
      const { error } = await supabase
        .from('feedback_ideas')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', ideaId);

      if (error) throw error;

      // Update local state
      set(state => ({
        ideas: state.ideas.map(idea =>
          idea.id === ideaId ? { ...idea, status } : idea
        )
      }));
    } catch (error) {
      console.error('Error updating idea status:', error);
      set({ error: (error as Error).message });
    }
  },

  setSortBy: (sort) => set({ sortBy: sort }),
  setFilterBy: (filter) => set({ filterBy: filter })
}));
