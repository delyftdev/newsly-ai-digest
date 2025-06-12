
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
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  company: null,
  teamMembers: [],
  branding: null,
  isLoading: false,

  fetchCompany: async () => {
    set({ isLoading: true });
    try {
      // First get the user's profile to find their company_id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError || !profile?.company_id) {
        console.error('Error fetching profile or no company_id:', profileError);
        set({ isLoading: false });
        return;
      }

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

      // Fetch team members without join - just basic team member data
      const { data: teamData, error: teamError } = await supabase
        .from('team_members')
        .select('*')
        .eq('company_id', profile.company_id)
        .eq('status', 'active');

      // If we need profile data, we can fetch it separately
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

      // Fetch branding
      const { data: brandingData, error: brandingError } = await supabase
        .from('branding')
        .select('*')
        .eq('company_id', profile.company_id)
        .single();

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
      const { error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', company.id);

      if (error) {
        return { error: error.message };
      }

      set({ company: { ...company, ...updates } });
      return {};
    } catch (error) {
      return { error: 'Failed to update company' };
    }
  },

  updateBranding: async (updates) => {
    const { branding, company } = get();
    if (!company) return { error: 'No company found' };

    try {
      const { error } = await supabase
        .from('branding')
        .update(updates)
        .eq('company_id', company.id);

      if (error) {
        return { error: error.message };
      }

      set({ branding: branding ? { ...branding, ...updates } : null });
      return {};
    } catch (error) {
      return { error: 'Failed to update branding' };
    }
  },

  inviteTeamMember: async (email: string, role: string) => {
    const { company } = get();
    if (!company) return { error: 'No company found' };

    try {
      const { error } = await supabase
        .from('team_invitations')
        .insert({
          company_id: company.id,
          email,
          role: role as 'admin' | 'editor' | 'viewer',
          status: 'pending',
        });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'Failed to invite team member' };
    }
  },
}));
