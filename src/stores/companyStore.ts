
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
      // Fetch company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .single();

      if (companyError) {
        console.error('Error fetching company:', companyError);
        set({ isLoading: false });
        return;
      }

      // Fetch team members
      const { data: teamData, error: teamError } = await supabase
        .from('team_members')
        .select('*')
        .eq('company_id', companyData.id)
        .eq('status', 'active');

      // Fetch branding
      const { data: brandingData, error: brandingError } = await supabase
        .from('branding')
        .select('*')
        .eq('company_id', companyData.id)
        .single();

      set({
        company: companyData,
        teamMembers: teamData || [],
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
      // In a real implementation, you'd send an invitation email
      // For now, we'll just add a pending team member
      const { error } = await supabase
        .from('team_members')
        .insert({
          company_id: company.id,
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
