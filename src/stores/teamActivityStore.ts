import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type TeamActivity = Database['public']['Tables']['team_activities']['Row'];

interface TeamActivityState {
  activities: TeamActivity[];
  isLoading: boolean;
  fetchActivities: () => Promise<void>;
  logActivity: (activity: {
    activityType: string;
    entityType: string;
    entityId?: string;
    description: string;
    metadata?: any;
  }) => Promise<void>;
}

export const useTeamActivityStore = create<TeamActivityState>((set, get) => ({
  activities: [],
  isLoading: false,

  fetchActivities: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ isLoading: false });
        return;
      }
      // Get user's company
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) {
        console.log('No company_id found for user');
        set({ isLoading: false });
        return;
      }

      // Fetch activities for the company
      const { data, error } = await supabase
        .from('team_activities')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching activities:', error);
        set({ isLoading: false });
        return;
      }

      console.log('Fetched activities:', data);
      set({ activities: data || [], isLoading: false });
    } catch (error) {
      console.error('Error in fetchActivities:', error);
      set({ isLoading: false });
    }
  },

  logActivity: async (activity) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's company
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) return;

      await supabase
        .from('team_activities')
        .insert({
          company_id: profile.company_id,
          user_id: user.id,
          activity_type: activity.activityType,
          entity_type: activity.entityType,
          entity_id: activity.entityId || null,
          description: activity.description,
          metadata: activity.metadata || null,
        });

      // Optionally refetch
      await get().fetchActivities();
    } catch (error) {
      // Silently ignore for now
    }
  },
}));
