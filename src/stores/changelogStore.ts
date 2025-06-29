
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from './authStore';
import { useCompanyStore } from './companyStore';

export interface Changelog {
  id: string;
  company_id: string;
  title: string;
  content: any;
  category: string;
  status: 'draft' | 'published';
  visibility: 'public' | 'private';
  featured_image_url?: string;
  video_url?: string;
  tags: string[];
  published_at?: string;
  published_by?: string;
  public_slug?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  auto_saved_at?: string;
  ai_generated: boolean;
}

interface ChangelogStore {
  changelogs: Changelog[];
  currentChangelog: Changelog | null;
  loading: boolean;
  autoSaveTimeout: NodeJS.Timeout | null;
  
  // Actions
  fetchChangelogs: () => Promise<void>;
  fetchChangelog: (id: string) => Promise<void>;
  createChangelog: (data: Partial<Changelog>) => Promise<{ data?: Changelog; error?: string }>;
  updateChangelog: (id: string, data: Partial<Changelog>) => Promise<{ error?: string }>;
  publishChangelog: (id: string) => Promise<{ error?: string }>;
  deleteChangelog: (id: string) => Promise<{ error?: string }>;
  autoSaveChangelog: (id: string, data: Partial<Changelog>) => Promise<void>;
  setCurrentChangelog: (changelog: Changelog | null) => void;
}

export const useChangelogStore = create<ChangelogStore>((set, get) => ({
  changelogs: [],
  currentChangelog: null,
  loading: false,
  autoSaveTimeout: null,

  fetchChangelogs: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('changelogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ changelogs: data || [] });
    } catch (error) {
      console.error('Error fetching changelogs:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchChangelog: async (id: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('changelogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ currentChangelog: data });
    } catch (error) {
      console.error('Error fetching changelog:', error);
      set({ currentChangelog: null });
    } finally {
      set({ loading: false });
    }
  },

  createChangelog: async (changelogData: Partial<Changelog>) => {
    try {
      const { user } = useAuthStore.getState();
      const { company } = useCompanyStore.getState();

      if (!user || !company) {
        return { error: 'User not authenticated or no company found' };
      }

      const { data, error } = await supabase
        .from('changelogs')
        .insert({
          ...changelogData,
          company_id: company.id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        changelogs: [data, ...state.changelogs],
        currentChangelog: data
      }));

      return { data };
    } catch (error: any) {
      console.error('Error creating changelog:', error);
      return { error: error.message };
    }
  },

  updateChangelog: async (id: string, updateData: Partial<Changelog>) => {
    try {
      const { data, error } = await supabase
        .from('changelogs')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        changelogs: state.changelogs.map(c => c.id === id ? data : c),
        currentChangelog: state.currentChangelog?.id === id ? data : state.currentChangelog
      }));

      return {};
    } catch (error: any) {
      console.error('Error updating changelog:', error);
      return { error: error.message };
    }
  },

  publishChangelog: async (id: string) => {
    try {
      const { user } = useAuthStore.getState();
      const { company } = useCompanyStore.getState();
      
      if (!user || !company) {
        return { error: 'User not authenticated' };
      }

      // Generate slug
      const changelog = get().currentChangelog;
      if (!changelog) return { error: 'Changelog not found' };

      const { data: slugData } = await supabase.rpc('generate_changelog_slug', {
        title: changelog.title,
        company_id: company.id
      });

      const { data, error } = await supabase
        .from('changelogs')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          published_by: user.id,
          public_slug: slugData,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        changelogs: state.changelogs.map(c => c.id === id ? data : c),
        currentChangelog: data
      }));

      return {};
    } catch (error: any) {
      console.error('Error publishing changelog:', error);
      return { error: error.message };
    }
  },

  deleteChangelog: async (id: string) => {
    try {
      const { error } = await supabase
        .from('changelogs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        changelogs: state.changelogs.filter(c => c.id !== id),
        currentChangelog: state.currentChangelog?.id === id ? null : state.currentChangelog
      }));

      return {};
    } catch (error: any) {
      console.error('Error deleting changelog:', error);
      return { error: error.message };
    }
  },

  autoSaveChangelog: async (id: string, data: Partial<Changelog>) => {
    const { autoSaveTimeout } = get();
    
    // Clear existing timeout
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    // Set new timeout for auto-save
    const newTimeout = setTimeout(async () => {
      try {
        await supabase
          .from('changelogs')
          .update({
            ...data,
            auto_saved_at: new Date().toISOString(),
          })
          .eq('id', id);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 3000); // Auto-save after 3 seconds of inactivity

    set({ autoSaveTimeout: newTimeout });
  },

  setCurrentChangelog: (changelog: Changelog | null) => {
    set({ currentChangelog: changelog });
  },
}));
