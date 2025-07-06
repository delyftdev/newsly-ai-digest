
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

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
  shareable_url?: string;
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

// Enhanced content processing function
const processContentForStorage = (content: any) => {
  if (!content) return { html: '' };
  
  if (typeof content === 'string') {
    return { html: content };
  }
  
  if (typeof content === 'object') {
    // If it already has the correct structure, return as-is
    if (content.html || content.content || content.type) {
      return content;
    }
    
    // If it's a plain object, wrap in html property
    return { html: JSON.stringify(content) };
  }
  
  return { html: '' };
};

export const useChangelogStore = create<ChangelogStore>((set, get) => ({
  changelogs: [],
  currentChangelog: null,
  loading: false,
  autoSaveTimeout: null,

  fetchChangelogs: async () => {
    console.log('=== FETCHING CHANGELOGS ===');
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('changelogs')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Fetch changelogs result:', { data, error });
      if (error) {
        console.error('Fetch changelogs error:', error);
        throw error;
      }
      const transformedData = (data || []).map(transformDbRow);
      console.log('Transformed changelogs:', transformedData);
      set({ changelogs: transformedData });
    } catch (error) {
      console.error('Error fetching changelogs:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchChangelog: async (id: string) => {
    console.log('=== FETCHING SINGLE CHANGELOG ===', id);
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('changelogs')
        .select('*')
        .eq('id', id)
        .maybeSingle(); // Use maybeSingle instead of single to handle missing records

      console.log('Fetch single changelog result:', { data, error });
      if (error) {
        console.error('Fetch changelog error:', error);
        throw error;
      }
      
      if (!data) {
        console.warn('Changelog not found:', id);
        set({ currentChangelog: null });
        throw new Error('Changelog not found');
      }
      
      const transformedData = transformDbRow(data);
      console.log('Transformed changelog:', transformedData);
      console.log('Content details:', {
        rawContent: data.content,
        transformedContent: transformedData.content,
        contentType: typeof data.content
      });
      set({ currentChangelog: transformedData });
    } catch (error) {
      console.error('Error fetching changelog:', error);
      set({ currentChangelog: null });
      throw error; // Re-throw to allow caller to handle
    } finally {
      set({ loading: false });
    }
  },

  createChangelog: async (changelogData: Partial<Changelog>) => {
    try {
      console.log('=== CREATE CHANGELOG START ===');
      console.log('Input data:', JSON.stringify(changelogData, null, 2));
      
      // Step 1: Check authentication
      console.log('Step 1: Checking authentication...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Auth check result:', { user: user?.id, authError });
      
      if (authError) {
        console.error('Authentication error:', authError);
        return { error: `Authentication failed: ${authError.message}` };
      }
      
      if (!user) {
        console.error('No authenticated user found');
        return { error: 'User not authenticated - please log in' };
      }

      // Step 2: Get user's company
      console.log('Step 2: Getting user company...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();
      
      console.log('Profile query result:', { profile, profileError });

      if (profileError) {
        console.error('Profile error:', profileError);
        return { error: `Profile error: ${profileError.message}` };
      }
      
      if (!profile?.company_id) {
        console.error('No company found for user');
        return { error: 'No company found for user - please complete onboarding' };
      }

      // Step 3: Prepare insert data with improved content handling
      console.log('Step 3: Preparing insert data...');
      
      const processedContent = processContentForStorage(changelogData.content);
      
      const insertData = {
        title: changelogData.title || '',
        content: processedContent,
        category: changelogData.category || 'announcement',
        status: changelogData.status || 'draft',
        visibility: changelogData.visibility || 'public',
        featured_image_url: changelogData.featured_image_url,
        video_url: changelogData.video_url,
        tags: changelogData.tags || [],
        company_id: profile.company_id,
        created_by: user.id,
        ai_generated: changelogData.ai_generated || false,
      };

      console.log('Final insert data:', JSON.stringify(insertData, null, 2));

      // Step 4: Insert into database
      console.log('Step 4: Inserting into database...');
      const { data, error } = await supabase
        .from('changelogs')
        .insert(insertData)
        .select()
        .single();

      console.log('Database insert result:', { data, error });

      if (error) {
        console.error('Database insert error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return { error: `Database error: ${error.message}` };
      }

      if (!data) {
        console.error('No data returned from insert');
        return { error: 'No data returned from database' };
      }

      // Step 5: Transform and update state
      console.log('Step 5: Updating state...');
      const transformedData = transformDbRow(data);
      console.log('Transformed data:', transformedData);
      
      set(state => ({
        changelogs: [transformedData, ...state.changelogs],
        currentChangelog: transformedData
      }));

      console.log('=== CREATE CHANGELOG SUCCESS ===');
      return { data: transformedData };
      
    } catch (error: any) {
      console.error('=== CREATE CHANGELOG ERROR ===');
      console.error('Unexpected error:', error);
      console.error('Error stack:', error.stack);
      return { error: `Unexpected error: ${error.message}` };
    }
  },

  updateChangelog: async (id: string, updateData: Partial<Changelog>) => {
    try {
      console.log('=== UPDATE CHANGELOG START ===');
      console.log('Updating changelog ID:', id);
      console.log('Update data:', JSON.stringify(updateData, null, 2));

      const processedContent = processContentForStorage(updateData.content);

      const { data, error } = await supabase
        .from('changelogs')
        .update({
          title: updateData.title,
          content: processedContent,
          category: updateData.category,
          status: updateData.status,
          visibility: updateData.visibility,
          featured_image_url: updateData.featured_image_url,
          video_url: updateData.video_url,
          tags: updateData.tags,
          ai_generated: updateData.ai_generated,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Database update error:', error);
        return { error: `Update failed: ${error.message}` };
      }

      const transformedData = transformDbRow(data);
      set(state => ({
        changelogs: state.changelogs.map(c => c.id === id ? transformedData : c),
        currentChangelog: state.currentChangelog?.id === id ? transformedData : state.currentChangelog
      }));

      console.log('=== UPDATE CHANGELOG SUCCESS ===');
      return {};
    } catch (error: any) {
      console.error('=== UPDATE CHANGELOG ERROR ===');
      console.error('Unexpected update error:', error);
      return { error: `Unexpected error: ${error.message}` };
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

      // Get company subdomain for URL generation
      const { data: company } = await supabase
        .from('companies')
        .select('subdomain')
        .eq('id', profile.company_id)
        .single();

      // Generate slug
      const changelog = get().currentChangelog;
      if (!changelog) return { error: 'Changelog not found' };

      const { data: slugData } = await supabase.rpc('generate_changelog_slug', {
        title: changelog.title,
        company_id: profile.company_id
      });

      // Generate the full shareable URL
      const shareableUrl = `${window.location.origin}/changelog/${company?.subdomain}/${slugData}`;

      const { data, error } = await supabase
        .from('changelogs')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          published_by: user.id,
          public_slug: slugData,
          shareable_url: shareableUrl,
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

      console.log('Changelog published with shareable URL:', shareableUrl);

      return {};
    } catch (error: any) {
      console.error('Error publishing changelog:', error);
      return { error: error.message };
    }
  },

  deleteChangelog: async (id: string) => {
    try {
      console.log('=== DELETE CHANGELOG START ===', id);
      
      const { error } = await supabase
        .from('changelogs')
        .delete()
        .eq('id', id);

      console.log('Delete result:', { error });

      if (error) {
        console.error('Database delete error:', error);
        throw error;
      }

      // Immediately update the state to remove the deleted changelog
      set(state => ({
        changelogs: state.changelogs.filter(c => c.id !== id),
        currentChangelog: state.currentChangelog?.id === id ? null : state.currentChangelog
      }));

      console.log('=== DELETE CHANGELOG SUCCESS ===');
      return {};
    } catch (error: any) {
      console.error('=== DELETE CHANGELOG ERROR ===');
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

    // Set new timeout for auto-save (reduced to 2 seconds for better responsiveness)
    const newTimeout = setTimeout(async () => {
      try {
        console.log('Auto-saving changelog:', id);
        
        const processedContent = processContentForStorage(data.content);
        
        await supabase
          .from('changelogs')
          .update({
            title: data.title,
            content: processedContent,
            category: data.category,
            status: data.status,
            visibility: data.visibility,
            featured_image_url: data.featured_image_url,
            video_url: data.video_url,
            tags: data.tags,
            auto_saved_at: new Date().toISOString(),
          })
          .eq('id', id);
        console.log('Auto-save completed for:', id);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    set({ autoSaveTimeout: newTimeout });
  },

  setCurrentChangelog: (changelog: Changelog | null) => {
    set({ currentChangelog: changelog });
  },
}));
