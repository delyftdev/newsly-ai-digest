
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Release = Database['public']['Tables']['releases']['Row'];

interface ReleaseState {
  releases: Release[];
  currentRelease: Release | null;
  isLoading: boolean;
  fetchReleases: () => Promise<void>;
  fetchRelease: (id: string) => Promise<void>;
  createRelease: (data: Partial<Release>) => Promise<{ id?: string; error?: string }>;
  updateRelease: (id: string, data: Partial<Release>) => Promise<{ error?: string }>;
  deleteRelease: (id: string) => Promise<{ error?: string }>;
  publishRelease: (id: string) => Promise<{ error?: string }>;
  duplicateRelease: (id: string) => Promise<{ id?: string; error?: string }>;
}

export const useReleaseStore = create<ReleaseState>((set, get) => ({
  releases: [],
  currentRelease: null,
  isLoading: false,

  fetchReleases: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching releases:', error);
        set({ isLoading: false });
        return;
      }

      set({ releases: data || [], isLoading: false });
    } catch (error) {
      console.error('Error in fetchReleases:', error);
      set({ isLoading: false });
    }
  },

  fetchRelease: async (id: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching release:', error);
        set({ isLoading: false });
        return;
      }

      set({ currentRelease: data, isLoading: false });
    } catch (error) {
      console.error('Error in fetchRelease:', error);
      set({ isLoading: false });
    }
  },

  createRelease: async (data) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return { error: 'User not authenticated' };

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) return { error: 'No company found' };

      const releaseData = {
        ...data,
        company_id: profile.company_id,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: release, error } = await supabase
        .from('releases')
        .insert(releaseData)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      // Update local state
      const { releases } = get();
      set({ releases: [release, ...releases] });

      return { id: release.id };
    } catch (error) {
      return { error: 'Failed to create release' };
    }
  },

  updateRelease: async (id: string, data) => {
    try {
      const updateData = {
        ...data,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('releases')
        .update(updateData)
        .eq('id', id);

      if (error) {
        return { error: error.message };
      }

      // Update local state
      const { releases, currentRelease } = get();
      const updatedReleases = releases.map(release =>
        release.id === id ? { ...release, ...updateData } : release
      );
      set({ 
        releases: updatedReleases,
        currentRelease: currentRelease?.id === id ? { ...currentRelease, ...updateData } : currentRelease
      });

      return {};
    } catch (error) {
      return { error: 'Failed to update release' };
    }
  },

  deleteRelease: async (id: string) => {
    try {
      const { error } = await supabase
        .from('releases')
        .delete()
        .eq('id', id);

      if (error) {
        return { error: error.message };
      }

      // Update local state
      const { releases } = get();
      const updatedReleases = releases.filter(release => release.id !== id);
      set({ releases: updatedReleases });

      return {};
    } catch (error) {
      return { error: 'Failed to delete release' };
    }
  },

  publishRelease: async (id: string) => {
    try {
      const { error } = await supabase
        .from('releases')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        return { error: error.message };
      }

      // Update local state
      const { releases, currentRelease } = get();
      const updateData = {
        status: 'published' as const,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const updatedReleases = releases.map(release =>
        release.id === id ? { ...release, ...updateData } : release
      );
      set({ 
        releases: updatedReleases,
        currentRelease: currentRelease?.id === id ? { ...currentRelease, ...updateData } : currentRelease
      });

      return {};
    } catch (error) {
      return { error: 'Failed to publish release' };
    }
  },

  duplicateRelease: async (id: string) => {
    try {
      const { releases } = get();
      const originalRelease = releases.find(r => r.id === id);
      if (!originalRelease) return { error: 'Release not found' };

      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return { error: 'User not authenticated' };

      const duplicateData = {
        ...originalRelease,
        id: undefined,
        title: `${originalRelease.title} (Copy)`,
        status: 'draft' as const,
        published_at: null,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: release, error } = await supabase
        .from('releases')
        .insert(duplicateData)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      // Update local state
      set({ releases: [release, ...releases] });

      return { id: release.id };
    } catch (error) {
      return { error: 'Failed to duplicate release' };
    }
  },
}));
