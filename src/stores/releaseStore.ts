
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Release = Database['public']['Tables']['releases']['Row'];
type ReleaseInsert = Database['public']['Tables']['releases']['Insert'];
type ReleaseUpdate = Database['public']['Tables']['releases']['Update'];

interface ReleaseState {
  releases: Release[];
  currentRelease: Release | null;
  isLoading: boolean;
  fetchReleases: () => Promise<void>;
  fetchRelease: (id: string) => Promise<void>;
  createRelease: (release: Partial<ReleaseInsert>) => Promise<{ data?: Release; error?: string }>;
  updateRelease: (id: string, updates: ReleaseUpdate) => Promise<{ error?: string }>;
  deleteRelease: (id: string) => Promise<{ error?: string }>;
  publishRelease: (id: string) => Promise<{ error?: string }>;
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

  createRelease: async (release) => {
    try {
      const { data, error } = await supabase
        .from('releases')
        .insert(release as ReleaseInsert)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      const { releases } = get();
      set({ releases: [data, ...releases] });
      return { data };
    } catch (error) {
      return { error: 'Failed to create release' };
    }
  },

  updateRelease: async (id: string, updates) => {
    try {
      const { error } = await supabase
        .from('releases')
        .update(updates)
        .eq('id', id);

      if (error) {
        return { error: error.message };
      }

      const { releases, currentRelease } = get();
      const updatedReleases = releases.map(r => 
        r.id === id ? { ...r, ...updates } : r
      );
      
      set({ 
        releases: updatedReleases,
        currentRelease: currentRelease?.id === id 
          ? { ...currentRelease, ...updates } 
          : currentRelease
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

      const { releases } = get();
      set({ releases: releases.filter(r => r.id !== id) });
      return {};
    } catch (error) {
      return { error: 'Failed to delete release' };
    }
  },

  publishRelease: async (id: string) => {
    return get().updateRelease(id, {
      status: 'published',
      published_at: new Date().toISOString(),
    });
  },
}));
