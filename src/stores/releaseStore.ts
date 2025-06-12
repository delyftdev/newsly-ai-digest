
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Release = Database['public']['Tables']['releases']['Row'];
type ReleaseInsert = Database['public']['Tables']['releases']['Insert'];

interface ReleaseState {
  releases: Release[];
  currentRelease: Release | null;
  isLoading: boolean;
  fetchReleases: () => Promise<void>;
  fetchRelease: (id: string) => Promise<void>;
  createRelease: (data: Partial<Release> & { title: string }) => Promise<{ id?: string; error?: string }>;
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

      // Ensure title is present and create proper insert data
      const releaseData: ReleaseInsert = {
        title: data.title, // Required field
        company_id: profile.company_id,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Optional fields from data
        ai_summary: data.ai_summary || null,
        category: data.category || null,
        content: data.content || null,
        featured_image_url: data.featured_image_url || null,
        published_at: data.published_at || null,
        release_date: data.release_date || null,
        release_type: data.release_type || null,
        source_id: data.source_id || null,
        source_type: data.source_type || null,
        status: data.status || 'draft',
        tags: data.tags || null,
        version: data.version || null,
        visibility: data.visibility || 'public',
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

      // Create proper insert data with required title field
      const duplicateData: ReleaseInsert = {
        title: `${originalRelease.title} (Copy)`, // Required field
        company_id: originalRelease.company_id,
        status: 'draft',
        published_at: null,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Copy all other fields
        ai_summary: originalRelease.ai_summary,
        category: originalRelease.category,
        content: originalRelease.content,
        featured_image_url: originalRelease.featured_image_url,
        release_date: originalRelease.release_date,
        release_type: originalRelease.release_type,
        source_id: originalRelease.source_id,
        source_type: originalRelease.source_type,
        tags: originalRelease.tags,
        version: originalRelease.version,
        visibility: originalRelease.visibility,
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
