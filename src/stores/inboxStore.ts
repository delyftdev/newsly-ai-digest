
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type InboxEmail = Database['public']['Tables']['inbox_emails']['Row'];
type InboxMessage = Database['public']['Tables']['inbox_messages']['Row'];

interface InboxState {
  emails: InboxEmail[];
  messages: InboxMessage[];
  isLoading: boolean;
  currentEmail: string | null;
  fetchEmails: () => Promise<void>;
  fetchMessages: () => Promise<void>;
  autoGenerateEmailOnOnboarding: (companyId: string) => Promise<{ error?: string }>;
}

export const useInboxStore = create<InboxState>((set, get) => ({
  emails: [],
  messages: [],
  isLoading: false,
  currentEmail: null,

  fetchEmails: async () => {
    set({ isLoading: true });
    try {
      console.log('Fetching inbox emails...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user');
        set({ isLoading: false });
        return;
      }

      // Get user's profile to find company_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) {
        console.log('No company_id found for user');
        set({ isLoading: false });
        return;
      }

      // Get all inbox emails for users in the same company
      const { data: teamMembers } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('company_id', profile.company_id)
        .eq('status', 'active');

      if (!teamMembers || teamMembers.length === 0) {
        console.log('No team members found');
        set({ isLoading: false });
        return;
      }

      const userIds = teamMembers.map(tm => tm.user_id);

      const { data, error } = await supabase
        .from('inbox_emails')
        .select('*')
        .in('user_id', userIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching emails:', error);
        set({ isLoading: false });
        return;
      }

      console.log('Fetched emails:', data);
      set({ emails: data || [], currentEmail: data?.[0]?.email_address || null });
    } catch (error) {
      console.error('Error in fetchEmails:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMessages: async () => {
    try {
      console.log('Fetching inbox messages...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) {
        console.error('No company_id found for user');
        return;
      }

      const { data, error } = await supabase
        .from('inbox_messages')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('received_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      console.log('Fetched messages:', data);
      set({ messages: data || [] });
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    }
  },

  autoGenerateEmailOnOnboarding: async (companyId: string) => {
    try {
      console.log('Auto-generating email for company:', companyId);
      
      // Get company subdomain
      const { data: company } = await supabase
        .from('companies')
        .select('subdomain')
        .eq('id', companyId)
        .single();

      if (!company?.subdomain) {
        return { error: 'Company subdomain not found' };
      }

      // Check if email already exists for this company
      const { data: teamMembers } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('company_id', companyId)
        .eq('status', 'active');

      if (teamMembers && teamMembers.length > 0) {
        const userIds = teamMembers.map(tm => tm.user_id);
        
        const { data: existingEmail } = await supabase
          .from('inbox_emails')
          .select('email_address')
          .in('user_id', userIds)
          .maybeSingle();

        if (existingEmail) {
          console.log('Email already exists for company');
          return { error: undefined };
        }
      }

      // Find admin user for this company
      const { data: adminMember } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('company_id', companyId)
        .eq('role', 'admin')
        .eq('status', 'active')
        .maybeSingle();

      if (!adminMember) {
        return { error: 'No admin user found for company' };
      }

      // Generate email address
      const randomSuffix = Math.random().toString(36).substring(2, 10);
      const emailAddress = `app-${company.subdomain}-${randomSuffix}@sandboxbb958968707c47d289a60ae9b53aff0f.mailgun.org`;

      // Create inbox email
      const { error: insertError } = await supabase
        .from('inbox_emails')
        .insert({
          user_id: adminMember.user_id,
          email_address: emailAddress
        });

      if (insertError) {
        console.error('Error creating inbox email:', insertError);
        return { error: 'Failed to create inbox email' };
      }

      console.log('Auto-generated email:', emailAddress);
      return { error: undefined };
    } catch (error) {
      console.error('Error in autoGenerateEmailOnOnboarding:', error);
      return { error: 'Failed to auto-generate email' };
    }
  },
}));
