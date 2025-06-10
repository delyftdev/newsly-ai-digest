
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface Release {
  id: string;
  company_id: string;
  title: string;
  content: any;
  category: string;
  release_type: string;
  version: string | null;
  release_date: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private';
  featured_image_url: string | null;
  ai_summary: string | null;
  tags: string[] | null;
  source_type: string;
  created_by: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ReleaseState {
  releases: Release[];
  currentRelease: Release | null;
  isLoading: boolean;
  fetchReleases: () => Promise<void>;
  fetchRelease: (id: string) => Promise<void>;
  createRelease: (release: Partial<Release>) => Promise<{ data?: Release; error?: string }>;
  updateRelease: (id: string, updates: Partial<Release>) => Promise<{ error?: string }>;
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
        .insert(release)
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
      status: 'published' as const,
      published_at: new Date().toISOString(),
    });
  },
}));
