
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

// Helper function to transform database row to Changelog type
const transformDbRow = (row: any): Changelog => ({
  ...row,
  status: row.status as 'draft' | 'published',
  visibility: row.visibility as 'public' | 'private',
  tags: row.tags || [],
});

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

      if (error) {
        console.error('Fetch changelogs error:', error);
        throw error;
      }
      set({ changelogs: (data || []).map(transformDbRow) });
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

      if (error) {
        console.error('Fetch changelog error:', error);
        throw error;
      }
      set({ currentChangelog: transformDbRow(data) });
    } catch (error) {
      console.error('Error fetching changelog:', error);
      set({ currentChangelog: null });
    } finally {
      set({ loading: false });
    }
  },

  createChangelog: async (changelogData: Partial<Changelog>) => {
    try {
      console.log('Creating changelog with data:', changelogData);
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Current user:', user, 'Auth error:', authError);
      
      if (authError || !user) {
        console.error('Authentication error:', authError);
        return { error: 'User not authenticated' };
      }

      // Get user's company from profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();
      
      console.log('User profile:', profile, 'Profile error:', profileError);

      if (profileError || !profile?.company_id) {
        console.error('Profile/company error:', profileError);
        return { error: 'No company found for user' };
      }

      const insertData = {
        title: changelogData.title || '',
        content: changelogData.content,
        category: changelogData.category,
        status: changelogData.status,
        visibility: changelogData.visibility,
        featured_image_url: changelogData.featured_image_url,
        video_url: changelogData.video_url,
        tags: changelogData.tags,
        company_id: profile.company_id,
        created_by: user.id,
      };

      console.log('Insert data:', insertData);

      const { data, error } = await supabase
        .from('changelogs')
        .insert(insertData)
        .select()
        .single();

      console.log('Insert result:', { data, error });

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      const transformedData = transformDbRow(data);
      set(state => ({
        changelogs: [transformedData, ...state.changelogs],
        currentChangelog: transformedData
      }));

      console.log('Successfully created changelog:', transformedData);
      return { data: transformedData };
    } catch (error: any) {
      console.error('Error creating changelog:', error);
      return { error: error.message || 'Failed to create changelog' };
    }
  },

  updateChangelog: async (id: string, updateData: Partial<Changelog>) => {
    try {
      console.log('Updating changelog:', id, 'with data:', updateData);

      const { data, error } = await supabase
        .from('changelogs')
        .update({
          title: updateData.title,
          content: updateData.content,
          category: updateData.category,
          status: updateData.status,
          visibility: updateData.visibility,
          featured_image_url: updateData.featured_image_url,
          video_url: updateData.video_url,
          tags: updateData.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      const transformedData = transformDbRow(data);
      set(state => ({
        changelogs: state.changelogs.map(c => c.id === id ? transformedData : c),
        currentChangelog: state.currentChangelog?.id === id ? transformedData : state.currentChangelog
      }));

      console.log('Successfully updated changelog:', transformedData);
      return {};
    } catch (error: any) {
      console.error('Error updating changelog:', error);
      return { error: error.message || 'Failed to update changelog' };
    }
  },

  publishChangelog: async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: 'User not authenticated' };
      }

      // Get user's company
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) {
        return { error: 'No company found' };
      }

      // Generate slug
      const changelog = get().currentChangelog;
      if (!changelog) return { error: 'Changelog not found' };

      const { data: slugData } = await supabase.rpc('generate_changelog_slug', {
        title: changelog.title,
        company_id: profile.company_id
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

      const transformedData = transformDbRow(data);
      set(state => ({
        changelogs: state.changelogs.map(c => c.id === id ? transformedData : c),
        currentChangelog: transformedData
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
            title: data.title,
            content: data.content,
            category: data.category,
            status: data.status,
            visibility: data.visibility,
            featured_image_url: data.featured_image_url,
            video_url: data.video_url,
            tags: data.tags,
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
