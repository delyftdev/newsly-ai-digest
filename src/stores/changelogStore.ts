
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

// Enhanced content processing with corruption prevention
const processContentForStorage = (content: any) => {
  console.log('=== PROCESSING CONTENT FOR STORAGE ===');
  console.log('Input content:', content);
  console.log('Content type:', typeof content);
  
  if (!content) {
    console.log('No content provided, returning empty HTML object');
    return { html: '' };
  }
  
  if (typeof content === 'string') {
    // Prevent corruption: don't save empty or meaningless content
    const trimmed = content.trim();
    if (!trimmed || trimmed === '<p></p>' || trimmed === '<br>' || trimmed === '<br/>') {
      console.log('Preventing storage of empty/meaningless HTML content');
      return { html: '' };
    }
    console.log('Processing string content, length:', trimmed.length);
    return { html: trimmed };
  }
  
  if (typeof content === 'object') {
    // If it already has the correct structure, validate and clean it
    if (content.html !== undefined) {
      const htmlContent = content.html || '';
      const trimmed = htmlContent.trim();
      
      if (!trimmed || trimmed === '<p></p>' || trimmed === '<br>' || trimmed === '<br/>') {
        console.log('Preventing storage of empty HTML object');
        return { html: '' };
      }
      
      console.log('Processing object with html property, length:', trimmed.length);
      return { html: trimmed };
    }
    
    // Handle other object formats
    if (content.content) {
      console.log('Processing object with content property');
      return processContentForStorage(content.content);
    }
    
    // If it's a complex object without html/content, stringify it
    try {
      const stringified = JSON.stringify(content);
      if (stringified && stringified !== '{}' && stringified !== 'null') {
        console.log('Processing complex object, stringified length:', stringified.length);
        return { html: stringified };
      }
    } catch (e) {
      console.error('Failed to stringify content object:', e);
    }
  }
  
  console.log('Defaulting to empty HTML content');
  return { html: '' };
};

// Content validation utility
const validateContentBeforeSave = (data: Partial<Changelog>): { isValid: boolean; reason?: string } => {
  console.log('=== VALIDATING CONTENT BEFORE SAVE ===');
  
  // Check if we have at least a title or meaningful content
  const hasTitle = Boolean(data.title?.trim());
  const processedContent = processContentForStorage(data.content);
  const hasContent = Boolean(processedContent.html?.trim());
  
  console.log('Validation check:', {
    hasTitle,
    hasContent,
    titleLength: data.title?.length || 0,
    contentLength: processedContent.html?.length || 0
  });
  
  if (!hasTitle && !hasContent) {
    return { isValid: false, reason: 'No title or content provided' };
  }
  
  return { isValid: true };
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

      console.log('Fetch changelogs result:', { data: data?.length, error });
      if (error) {
        console.error('Fetch changelogs error:', error);
        throw error;
      }
      const transformedData = (data || []).map(transformDbRow);
      console.log('Transformed changelogs count:', transformedData.length);
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
        .maybeSingle();

      console.log('Fetch single changelog result:', { 
        found: Boolean(data), 
        error: error?.message,
        dataId: data?.id 
      });
      
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
      console.log('Fetched changelog:', {
        id: transformedData.id,
        title: transformedData.title,
        contentType: typeof transformedData.content,
        contentKeys: transformedData.content ? Object.keys(transformedData.content) : []
      });
      
      set({ currentChangelog: transformedData });
    } catch (error) {
      console.error('Error fetching changelog:', error);
      set({ currentChangelog: null });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createChangelog: async (changelogData: Partial<Changelog>) => {
    try {
      console.log('=== CREATE CHANGELOG START ===');
      console.log('Input data:', {
        title: changelogData.title,
        hasContent: Boolean(changelogData.content),
        category: changelogData.category
      });
      
      // Validate content before proceeding
      const validation = validateContentBeforeSave(changelogData);
      if (!validation.isValid) {
        console.log('Content validation failed:', validation.reason);
        return { error: `Validation failed: ${validation.reason}` };
      }
      
      // Check authentication
      console.log('Checking authentication...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Auth check result:', { userId: user?.id, authError: authError?.message });
      
      if (authError) {
        console.error('Authentication error:', authError);
        return { error: `Authentication failed: ${authError.message}` };
      }
      
      if (!user) {
        console.error('No authenticated user found');
        return { error: 'User not authenticated - please log in' };
      }

      // Get user's company
      console.log('Getting user company...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();
      
      console.log('Profile query result:', { 
        companyId: profile?.company_id, 
        profileError: profileError?.message 
      });

      if (profileError) {
        console.error('Profile error:', profileError);
        return { error: `Profile error: ${profileError.message}` };
      }
      
      if (!profile?.company_id) {
        console.error('No company found for user');
        return { error: 'No company found for user - please complete onboarding' };
      }

      // Process content with corruption prevention
      console.log('Processing content for storage...');
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

      console.log('Final insert data:', {
        title: insertData.title,
        contentHtml: insertData.content.html?.substring(0, 100) + '...',
        category: insertData.category,
        status: insertData.status
      });

      // Insert into database
      console.log('Inserting into database...');
      const { data, error } = await supabase
        .from('changelogs')
        .insert(insertData)
        .select()
        .single();

      console.log('Database insert result:', { 
        success: Boolean(data), 
        error: error?.message,
        newId: data?.id 
      });

      if (error) {
        console.error('Database insert error:', error);
        return { error: `Database error: ${error.message}` };
      }

      if (!data) {
        console.error('No data returned from insert');
        return { error: 'No data returned from database' };
      }

      // Transform and update state
      const transformedData = transformDbRow(data);
      console.log('Created changelog:', transformedData.id);
      
      set(state => ({
        changelogs: [transformedData, ...state.changelogs],
        currentChangelog: transformedData
      }));

      console.log('=== CREATE CHANGELOG SUCCESS ===');
      return { data: transformedData };
      
    } catch (error: any) {
      console.error('=== CREATE CHANGELOG ERROR ===');
      console.error('Unexpected error:', error);
      return { error: `Unexpected error: ${error.message}` };
    }
  },

  updateChangelog: async (id: string, updateData: Partial<Changelog>) => {
    try {
      console.log('=== UPDATE CHANGELOG START ===');
      console.log('Updating changelog ID:', id);
      console.log('Update data keys:', Object.keys(updateData));

      // Validate content before proceeding
      const validation = validateContentBeforeSave(updateData);
      if (!validation.isValid) {
        console.log('Update validation failed:', validation.reason);
        // For updates, we allow empty content as it might be a partial update
        if (!updateData.title?.trim() && !updateData.content) {
          console.log('Skipping update: no meaningful changes');
          return {};
        }
      }

      const processedContent = processContentForStorage(updateData.content);

      const updatePayload = {
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
      };

      console.log('Update payload:', {
        title: updatePayload.title,
        contentHtml: updatePayload.content.html?.substring(0, 100) + '...',
        category: updatePayload.category
      });

      const { data, error } = await supabase
        .from('changelogs')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      console.log('Update result:', { 
        success: Boolean(data), 
        error: error?.message 
      });

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
      console.log('=== PUBLISH CHANGELOG START ===', id);
      
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

      console.log('Changelog published with URL:', shareableUrl);

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

      console.log('Delete result:', { error: error?.message });

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

    // Set new timeout for auto-save
    const newTimeout = setTimeout(async () => {
      try {
        console.log('=== AUTO-SAVE EXECUTING ===', id);
        
        // Validate before auto-save
        const validation = validateContentBeforeSave(data);
        if (!validation.isValid) {
          console.log('Auto-save validation failed:', validation.reason);
          return;
        }
        
        const processedContent = processContentForStorage(data.content);
        
        const { error } = await supabase
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
          
        if (error) {
          console.error('Auto-save failed:', error);
        } else {
          console.log('Auto-save completed successfully for:', id);
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 1500); // Reduced timeout for more responsive auto-save

    set({ autoSaveTimeout: newTimeout });
  },

  setCurrentChangelog: (changelog: Changelog | null) => {
    console.log('=== SETTING CURRENT CHANGELOG ===', changelog?.id || 'null');
    set({ currentChangelog: changelog });
  },
}));
