
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
  generateEmail: () => Promise<{ error?: string }>;
  ensureCompanyEmail: () => Promise<string | null>;
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
      const { data, error } = await supabase
        .from('inbox_emails')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching emails:', error);
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
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError || !profile?.company_id) {
        console.error('Error fetching profile or no company_id:', profileError);
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

  generateEmail: async () => {
    try {
      console.log('Starting email generation...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'User not authenticated' };
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile?.company_id) {
        console.error('Error fetching profile or no company_id:', profileError);
        return { error: 'Company not found. Please complete your onboarding first.' };
      }

      console.log('Calling ensure_company_inbox_email for company:', profile.company_id);
      
      // Use the database function to ensure company email
      const { data: emailAddress, error: emailError } = await supabase
        .rpc('ensure_company_inbox_email', { company_uuid: profile.company_id });

      if (emailError) {
        console.error('Error generating email:', emailError);
        return { error: 'Failed to generate email address: ' + emailError.message };
      }

      console.log('Generated email address:', emailAddress);

      // Refresh emails to show the new one
      await get().fetchEmails();
      
      return { error: undefined };
    } catch (error) {
      console.error('Error in generateEmail:', error);
      return { error: 'Failed to generate email address' };
    }
  },

  ensureCompanyEmail: async () => {
    try {
      console.log('Ensuring company email exists...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user');
        return null;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile?.company_id) {
        console.error('Error fetching profile or no company_id:', profileError);
        return null;
      }

      console.log('User company_id:', profile.company_id);

      // Check if company already has an email
      const { data: existingEmails, error: emailsError } = await supabase
        .from('inbox_emails')
        .select('email_address')
        .limit(1);

      if (emailsError) {
        console.error('Error checking existing emails:', emailsError);
      }

      if (existingEmails && existingEmails.length > 0) {
        console.log('Found existing email:', existingEmails[0].email_address);
        return existingEmails[0].email_address;
      }

      console.log('No existing email found, generating new one...');

      // Generate email using database function
      const { data: emailAddress, error: emailError } = await supabase
        .rpc('ensure_company_inbox_email', { company_uuid: profile.company_id });

      if (emailError) {
        console.error('Error ensuring company email:', emailError);
        return null;
      }

      console.log('Successfully ensured company email:', emailAddress);
      return emailAddress;
    } catch (error) {
      console.error('Error in ensureCompanyEmail:', error);
      return null;
    }
  },
}));
