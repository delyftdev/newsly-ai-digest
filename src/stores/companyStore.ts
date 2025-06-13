
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

interface CompanyState {
  company: Company | null;
  teamMembers: TeamMember[];
  branding: Branding | null;
  isLoading: boolean;
  fetchCompany: () => Promise<void>;
  updateCompany: (updates: Partial<Company>) => Promise<{ error?: string }>;
  updateBranding: (updates: Partial<Branding>) => Promise<{ error?: string }>;
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
    const { company } = get();
    if (!company) return { error: 'No company found' };

    try {
      console.log('Updating company with:', updates);
      const { error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', company.id);

      if (error) {
        console.error('Error updating company:', error);
        return { error: error.message };
      }

      console.log('Company updated successfully');
      set({ company: { ...company, ...updates } });
      return {};
    } catch (error) {
      console.error('Error in updateCompany:', error);
      return { error: 'Failed to update company' };
    }
  },

  updateBranding: async (updates) => {
    const { branding, company } = get();
    if (!company) return { error: 'No company found' };

    try {
      console.log('Updating branding with:', updates);
      if (branding) {
        const { error } = await supabase
          .from('branding')
          .update(updates)
          .eq('company_id', company.id);

        if (error) {
          console.error('Error updating branding:', error);
          return { error: error.message };
        }

        set({ branding: { ...branding, ...updates } });
      } else {
        // Create branding if it doesn't exist
        const { data, error } = await supabase
          .from('branding')
          .insert({
            company_id: company.id,
            ...updates
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating branding:', error);
          return { error: error.message };
        }

        console.log('Created new branding:', data);
        set({ branding: data });
      }
      
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

      // Check if user has a profile with company_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        return { error: 'Failed to fetch profile' };
      }

      console.log('Current profile:', profile);

      // If no profile or no company_id, trigger the company creation
      if (!profile || !profile.company_id) {
        console.log('No company found, triggering company creation...');
        // This will trigger the database function to create company
        const { error: triggerError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email,
            updated_at: new Date().toISOString(),
          });

        if (triggerError) {
          console.error('Error triggering company setup:', triggerError);
          return { error: 'Failed to ensure company setup' };
        }

        console.log('Company creation triggered successfully');
      }

      return {};
    } catch (error) {
      console.error('Error in ensureUserCompany:', error);
      return { error: 'Failed to ensure user company' };
    }
  },
}));
