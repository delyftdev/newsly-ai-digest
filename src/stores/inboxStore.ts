
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
      const { data, error } = await supabase
        .from('inbox_emails')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching emails:', error);
        return;
      }

      set({ emails: data || [], currentEmail: data?.[0]?.email_address || null });
    } catch (error) {
      console.error('Error in fetchEmails:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMessages: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('inbox_messages')
        .select('*')
        .order('received_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      set({ messages: data || [] });
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  generateEmail: async () => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError || !profile?.company_id) {
        console.error('Error fetching profile or no company_id:', profileError);
        return { error: 'Company not found. Please complete your onboarding first.' };
      }

      // Use the database function to ensure company email
      const { data: emailAddress, error: emailError } = await supabase
        .rpc('ensure_company_inbox_email', { company_uuid: profile.company_id });

      if (emailError) {
        console.error('Error generating email:', emailError);
        return { error: 'Failed to generate email address' };
      }

      // Refresh emails
      await get().fetchEmails();
      
      return { error: undefined };
    } catch (error) {
      console.error('Error in generateEmail:', error);
      return { error: 'Failed to generate email address' };
    }
  },

  ensureCompanyEmail: async () => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError || !profile?.company_id) {
        return null;
      }

      // Check if company already has an email
      const { data: existingEmails } = await supabase
        .from('inbox_emails')
        .select('email_address')
        .limit(1);

      if (existingEmails && existingEmails.length > 0) {
        return existingEmails[0].email_address;
      }

      // Generate email using database function
      const { data: emailAddress, error: emailError } = await supabase
        .rpc('ensure_company_inbox_email', { company_uuid: profile.company_id });

      if (emailError) {
        console.error('Error ensuring company email:', emailError);
        return null;
      }

      return emailAddress;
    } catch (error) {
      console.error('Error in ensureCompanyEmail:', error);
      return null;
    }
  },
}));
