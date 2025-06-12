import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type InboxMessage = Database['public']['Tables']['inbox_messages']['Row'];
type InboxEmail = Database['public']['Tables']['inbox_emails']['Row'];

interface InboxState {
  messages: InboxMessage[];
  inboxEmail: InboxEmail | null;
  isLoading: boolean;
  selectedCategory: string;
  searchQuery: string;
  fetchMessages: () => Promise<void>;
  fetchInboxEmail: () => Promise<void>;
  createInboxEmail: () => Promise<{ email?: string; error?: string }>;
  categorizeMessage: (messageId: string, category: string) => Promise<{ error?: string }>;
  convertToRelease: (messageId: string) => Promise<{ error?: string }>;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  deleteMessage: (messageId: string) => Promise<{ error?: string }>;
}

export const useInboxStore = create<InboxState>((set, get) => ({
  messages: [],
  inboxEmail: null,
  isLoading: false,
  selectedCategory: 'all',
  searchQuery: '',

  fetchMessages: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('inbox_messages')
        .select('*')
        .order('received_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        set({ isLoading: false });
        return;
      }

      set({ messages: data || [], isLoading: false });
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      set({ isLoading: false });
    }
  },

  fetchInboxEmail: async () => {
    try {
      const { data, error } = await supabase
        .from('inbox_emails')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching inbox email:', error);
        return;
      }

      set({ inboxEmail: data });
    } catch (error) {
      console.error('Error in fetchInboxEmail:', error);
    }
  },

  createInboxEmail: async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return { error: 'User not authenticated' };

      // Generate unique email using Mailgun sandbox domain
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const emailAddress = `inbox-${timestamp}-${randomSuffix}@sandboxbb958968707c47d289a60ae9b53aff0f.mailgun.org`;

      console.log('Creating inbox email:', emailAddress);

      // Create the inbox email record first
      const { data, error } = await supabase
        .from('inbox_emails')
        .insert({
          user_id: user.id,
          email_address: emailAddress,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating inbox email:', error);
        return { error: error.message };
      }

      console.log('Inbox email created, now creating Mailgun route');

      // Create Mailgun route via edge function
      try {
        const { data: routeResult, error: routeError } = await supabase.functions.invoke('create-mailgun-route', {
          body: { emailAddress }
        });

        if (routeError) {
          console.error('Error creating Mailgun route:', routeError);
          // Don't fail completely, the email is still created
          console.warn('Mailgun route creation failed, but email address is still usable');
        } else {
          console.log('Mailgun route created successfully:', routeResult);
        }
      } catch (routeError) {
        console.error('Error calling create-mailgun-route function:', routeError);
        // Continue anyway, the email address is still created
      }

      set({ inboxEmail: data });
      return { email: emailAddress };
    } catch (error) {
      console.error('Error in createInboxEmail:', error);
      return { error: 'Failed to create inbox email' };
    }
  },

  categorizeMessage: async (messageId: string, category: string) => {
    try {
      const { error } = await supabase
        .from('inbox_messages')
        .update({ category })
        .eq('id', messageId);

      if (error) {
        return { error: error.message };
      }

      // Update local state
      const { messages } = get();
      const updatedMessages = messages.map(msg =>
        msg.id === messageId ? { ...msg, category } : msg
      );
      set({ messages: updatedMessages });

      return {};
    } catch (error) {
      return { error: 'Failed to categorize message' };
    }
  },

  convertToRelease: async (messageId: string) => {
    try {
      const { messages } = get();
      const message = messages.find(m => m.id === messageId);
      if (!message) return { error: 'Message not found' };

      // Get user's company
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return { error: 'User not authenticated' };

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) return { error: 'No company found' };

      // Create release from message
      const { error } = await supabase
        .from('releases')
        .insert({
          company_id: profile.company_id,
          title: message.subject || 'Untitled Release',
          content: { blocks: [{ type: 'paragraph', data: { text: message.content || '' } }] },
          category: message.category || 'announcement',
          source_type: 'email',
          source_id: messageId,
          created_by: user.id,
          ai_summary: message.ai_summary,
        });

      if (error) {
        return { error: error.message };
      }

      // Mark message as processed
      await supabase
        .from('inbox_messages')
        .update({ is_processed: true })
        .eq('id', messageId);

      // Update local state
      const updatedMessages = messages.map(msg =>
        msg.id === messageId ? { ...msg, is_processed: true } : msg
      );
      set({ messages: updatedMessages });

      return {};
    } catch (error) {
      return { error: 'Failed to convert to release' };
    }
  },

  deleteMessage: async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('inbox_messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        return { error: error.message };
      }

      // Update local state
      const { messages } = get();
      const updatedMessages = messages.filter(msg => msg.id !== messageId);
      set({ messages: updatedMessages });

      return {};
    } catch (error) {
      return { error: 'Failed to delete message' };
    }
  },

  setSelectedCategory: (category: string) => set({ selectedCategory: category }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
}));
