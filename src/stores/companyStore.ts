
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Company = Database['public']['Tables']['companies']['Row'];
type TeamMember = Database['public']['Tables']['team_members']['Row'] & {
  profiles?: {
    full_name: string | null;
  };
};
type Branding = Database['public']['Tables']['branding']['Row'];

// Type for our upsert function responses
interface UpsertResponse {
  success: boolean;
  error?: string;
  message?: string;
  company_id?: string;
}

interface CompanyState {
  company: Company | null;
  teamMembers: TeamMember[];
  branding: Branding | null;
  isLoading: boolean;
  fetchCompany: () => Promise<void>;
  updateCompany: (updates: Partial<Company>) => Promise<{ error?: string }>;
  updateBranding: (updates: Partial<Branding>) => Promise<{ error?: string }>;
  updateProfile: (updates: { full_name?: string; role?: string }) => Promise<{ error?: string }>;
  inviteTeamMember: (email: string, role: string) => Promise<{ error?: string }>;
  ensureUserCompany: () => Promise<{ error?: string }>;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  company: null,
  teamMembers: [],
  branding: null,
  isLoading: false,

  fetchCompany: async () => {
    set({ isLoading: true });
    try {
      console.log('Fetching company data...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user');
        set({ isLoading: false });
        return;
      }

      // First get the user's profile to find their company_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile?.company_id) {
        console.error('Error fetching profile or no company_id:', profileError);
        set({ isLoading: false });
        return;
      }

      console.log('User company_id:', profile.company_id);

      // Fetch company data using the company_id from profile
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single();

      if (companyError) {
        console.error('Error fetching company:', companyError);
        set({ isLoading: false });
        return;
      }

      console.log('Fetched company data:', companyData);

      // Fetch team members
      const { data: teamData, error: teamError } = await supabase
        .from('team_members')
        .select('*')
        .eq('company_id', profile.company_id)
        .eq('status', 'active');

      if (teamError) {
        console.error('Error fetching team members:', teamError);
      }

      // Enrich team data with profile information
      let enrichedTeamData: TeamMember[] = [];
      if (teamData && teamData.length > 0) {
        const userIds = teamData.map(tm => tm.user_id).filter(Boolean);
        
        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds);
          
          enrichedTeamData = teamData.map(teamMember => ({
            ...teamMember,
            profiles: profilesData?.find(p => p.id === teamMember.user_id) 
              ? { full_name: profilesData.find(p => p.id === teamMember.user_id)?.full_name || null }
              : undefined
          }));
        } else {
          enrichedTeamData = teamData;
        }
      }

      console.log('Enriched team data:', enrichedTeamData);

      // Fetch branding
      const { data: brandingData, error: brandingError } = await supabase
        .from('branding')
        .select('*')
        .eq('company_id', profile.company_id)
        .single();

      if (brandingError && brandingError.code !== 'PGRST116') {
        console.error('Error fetching branding:', brandingError);
      }

      console.log('Fetched branding data:', brandingData);

      set({
        company: companyData,
        teamMembers: enrichedTeamData,
        branding: brandingData,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error in fetchCompany:', error);
      set({ isLoading: false });
    }
  },

  updateCompany: async (updates) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: 'User not authenticated' };

      console.log('Updating company with upsert function:', updates);
      
      const { data, error } = await supabase.rpc('upsert_company_info', {
        user_uuid: user.id,
        company_name: updates.name,
        company_domain: updates.domain,
        company_team_size: updates.team_size,
        company_industry: updates.industry
      });

      if (error) {
        console.error('Error calling upsert_company_info:', error);
        return { error: error.message };
      }

      const response = data as UpsertResponse;
      if (!response.success) {
        console.error('Upsert function returned error:', response.error);
        return { error: response.error };
      }

      console.log('Company updated successfully:', response);
      
      // Refresh the company data
      await get().fetchCompany();
      
      return {};
    } catch (error) {
      console.error('Error in updateCompany:', error);
      return { error: 'Failed to update company' };
    }
  },

  updateProfile: async (updates) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: 'User not authenticated' };

      console.log('Updating profile with upsert function:', updates);
      
      const { data, error } = await supabase.rpc('upsert_profile_info', {
        user_uuid: user.id,
        user_full_name: updates.full_name,
        user_role: updates.role
      });

      if (error) {
        console.error('Error calling upsert_profile_info:', error);
        return { error: error.message };
      }

      const response = data as UpsertResponse;
      if (!response.success) {
        console.error('Upsert function returned error:', response.error);
        return { error: response.error };
      }

      console.log('Profile updated successfully:', response);
      return {};
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { error: 'Failed to update profile' };
    }
  },

  updateBranding: async (updates) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: 'User not authenticated' };

      console.log('Updating branding with upsert function:', updates);
      
      const { data, error } = await supabase.rpc('upsert_branding_info', {
        user_uuid: user.id,
        brand_primary_color: updates.primary_color,
        brand_secondary_color: updates.secondary_color,
        brand_font_family: updates.font_family
      });

      if (error) {
        console.error('Error calling upsert_branding_info:', error);
        return { error: error.message };
      }

      const response = data as UpsertResponse;
      if (!response.success) {
        console.error('Upsert function returned error:', response.error);
        return { error: response.error };
      }

      console.log('Branding updated successfully:', response);
      
      // Refresh the company data to get updated branding
      await get().fetchCompany();
      
      return {};
    } catch (error) {
      console.error('Error in updateBranding:', error);
      return { error: 'Failed to update branding' };
    }
  },

  inviteTeamMember: async (email: string, role: string) => {
    const { company } = get();
    if (!company) return { error: 'No company found' };

    try {
      console.log('Inviting team member:', email, role);
      const { error } = await supabase
        .from('team_invitations')
        .insert({
          company_id: company.id,
          email,
          role: role as 'admin' | 'editor' | 'viewer',
          status: 'pending',
        });

      if (error) {
        console.error('Error inviting team member:', error);
        return { error: error.message };
      }

      console.log('Team member invited successfully');
      return {};
    } catch (error) {
      console.error('Error in inviteTeamMember:', error);
      return { error: 'Failed to invite team member' };
    }
  },

  ensureUserCompany: async () => {
    try {
      console.log('Ensuring user has a company...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { error: 'User not authenticated' };

      // Refresh company data - the migration should have set everything up
      await get().fetchCompany();
      
      return {};
    } catch (error) {
      console.error('Error in ensureUserCompany:', error);
      return { error: 'Failed to ensure user company' };
    }
  },
}));
