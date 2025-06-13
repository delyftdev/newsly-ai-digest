
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type InboxEmail = Database['public']['Tables']['inbox_emails']['Row'];
type InboxMessage = Database['public']['Tables']['inbox_messages']['Row'];

interface DiagnosticStatus {
  mailgunApiConnection: 'checking' | 'success' | 'error';
  routeCreation: 'checking' | 'success' | 'error';
  emailGeneration: 'checking' | 'success' | 'error';
  testEmail: 'idle' | 'sending' | 'success' | 'error';
}

interface InboxState {
  emails: InboxEmail[];
  messages: InboxMessage[];
  isLoading: boolean;
  currentEmail: string | null;
  diagnostics: DiagnosticStatus;
  diagnosticMessages: Record<string, string>;
  fetchEmails: () => Promise<void>;
  fetchMessages: () => Promise<void>;
  generateEmail: () => Promise<{ error?: string }>;
  ensureCompanyEmail: () => Promise<string | null>;
  runDiagnostics: () => Promise<void>;
  sendTestEmail: () => Promise<{ error?: string }>;
}

export const useInboxStore = create<InboxState>((set, get) => ({
  emails: [],
  messages: [],
  isLoading: false,
  currentEmail: null,
  diagnostics: {
    mailgunApiConnection: 'checking',
    routeCreation: 'checking',
    emailGeneration: 'checking',
    testEmail: 'idle'
  },
  diagnosticMessages: {},

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

      // Auto-generate email if none exists
      if (!data || data.length === 0) {
        console.log('No emails found, auto-generating...');
        await get().generateEmail();
      }
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

  generateEmail: async () => {
    try {
      console.log('Starting simplified email generation...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: 'User not authenticated' };
      }

      // Get user's profile with company info - simplified approach
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile?.company_id) {
        console.error('Error fetching profile or no company_id:', profileError);
        return { error: 'Company not found. Please complete your setup first.' };
      }

      console.log('User profile found, company_id:', profile.company_id);

      // Check if user already has an inbox email
      const { data: existingEmail } = await supabase
        .from('inbox_emails')
        .select('email_address')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingEmail) {
        console.log('User already has email:', existingEmail.email_address);
        set(state => ({ currentEmail: existingEmail.email_address }));
        return { error: undefined };
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

      // Simplified approach - check user's own emails first
      const { data: userEmail } = await supabase
        .from('inbox_emails')
        .select('email_address')
        .eq('user_id', user.id)
        .maybeSingle();

      if (userEmail) {
        console.log('Found user email:', userEmail.email_address);
        return userEmail.email_address;
      }

      // If no user email, generate one
      const generateResult = await get().generateEmail();
      if (generateResult?.error) {
        console.error('Failed to generate email:', generateResult.error);
        return null;
      }

      // Return the newly generated email
      const { data: newEmail } = await supabase
        .from('inbox_emails')
        .select('email_address')
        .eq('user_id', user.id)
        .maybeSingle();

      return newEmail?.email_address || null;
    } catch (error) {
      console.error('Error in ensureCompanyEmail:', error);
      return null;
    }
  },

  runDiagnostics: async () => {
    console.log('Running email system diagnostics...');
    
    set({
      diagnostics: {
        mailgunApiConnection: 'checking',
        routeCreation: 'checking',
        emailGeneration: 'checking',
        testEmail: 'idle'
      },
      diagnosticMessages: {}
    });

    try {
      // Test 1: Mailgun API Connection - use proper parameters
      console.log('Testing Mailgun API connection...');
      const { data: mailgunTest, error: mailgunError } = await supabase.functions.invoke('create-mailgun-route', {
        body: { createCatchAll: true }
      });

      console.log('Mailgun test response:', mailgunTest);
      console.log('Mailgun test error:', mailgunError);

      if (mailgunError) {
        console.error('Mailgun API test failed with error:', mailgunError);
        set(state => ({
          diagnostics: { ...state.diagnostics, mailgunApiConnection: 'error' },
          diagnosticMessages: { ...state.diagnosticMessages, mailgunApiConnection: `Error: ${mailgunError.message}` }
        }));
      } else if (!mailgunTest?.success) {
        console.error('Mailgun API test failed:', mailgunTest?.error);
        set(state => ({
          diagnostics: { ...state.diagnostics, mailgunApiConnection: 'error' },
          diagnosticMessages: { ...state.diagnosticMessages, mailgunApiConnection: mailgunTest?.error || 'API connection failed' }
        }));
      } else {
        console.log('Mailgun API test successful');
        set(state => ({
          diagnostics: { ...state.diagnostics, mailgunApiConnection: 'success' },
          diagnosticMessages: { ...state.diagnosticMessages, mailgunApiConnection: 'API connection successful' }
        }));
      }

      // Test 2: Route Creation - this is actually covered by the catch-all creation above
      console.log('Route creation test - covered by catch-all creation');
      const routeStatus = mailgunTest?.success ? 'success' : 'error';
      const routeMessage = mailgunTest?.success ? 'Route creation working' : 'Route creation failed';
      
      set(state => ({
        diagnostics: { ...state.diagnostics, routeCreation: routeStatus },
        diagnosticMessages: { ...state.diagnosticMessages, routeCreation: routeMessage }
      }));

      // Test 3: Email Generation
      console.log('Testing email generation...');
      const emailGenResult = await get().ensureCompanyEmail();
      if (emailGenResult) {
        console.log('Email generation test successful:', emailGenResult);
        set(state => ({
          diagnostics: { ...state.diagnostics, emailGeneration: 'success' },
          diagnosticMessages: { ...state.diagnosticMessages, emailGeneration: `Email ready: ${emailGenResult}` }
        }));
      } else {
        console.error('Email generation test failed');
        set(state => ({
          diagnostics: { ...state.diagnostics, emailGeneration: 'error' },
          diagnosticMessages: { ...state.diagnosticMessages, emailGeneration: 'Failed to generate email address' }
        }));
      }

    } catch (error) {
      console.error('Error during diagnostics:', error);
      set(state => ({
        diagnostics: { 
          mailgunApiConnection: 'error',
          routeCreation: 'error', 
          emailGeneration: 'error',
          testEmail: 'idle'
        },
        diagnosticMessages: { 
          mailgunApiConnection: 'Diagnostic failed: ' + error.message,
          routeCreation: 'Diagnostic failed: ' + error.message,
          emailGeneration: 'Diagnostic failed: ' + error.message
        }
      }));
    }
  },

  sendTestEmail: async () => {
    const currentEmail = get().currentEmail;
    if (!currentEmail) {
      return { error: 'No email address available for testing' };
    }

    set(state => ({ diagnostics: { ...state.diagnostics, testEmail: 'sending' } }));

    try {
      console.log('Sending test email to:', currentEmail);
      
      // Extract company name from email address for proper parsing test
      const emailParts = currentEmail.split('@')[0];
      const companyName = emailParts.replace('app-', '').split('-')[0];
      
      const { data, error } = await supabase.functions.invoke('mailgun-webhook', {
        body: {
          'event-data': {
            event: 'delivered',
            recipient: currentEmail,
            message: {
              headers: {
                'from': 'test@example.com',
                'subject': `Test email for ${companyName}`
              }
            }
          },
          signature: {
            token: 'test-token',
            timestamp: Math.floor(Date.now() / 1000).toString(),
            signature: 'test-signature'
          }
        }
      });

      if (error) {
        console.error('Test email failed:', error);
        set(state => ({
          diagnostics: { ...state.diagnostics, testEmail: 'error' },
          diagnosticMessages: { ...state.diagnosticMessages, testEmail: error.message }
        }));
        return { error: error.message };
      }

      console.log('Test email sent successfully:', data);
      set(state => ({
        diagnostics: { ...state.diagnostics, testEmail: 'success' },
        diagnosticMessages: { ...state.diagnosticMessages, testEmail: 'Test email processed successfully' }
      }));

      // Refresh messages to show the test
      await get().fetchMessages();
      
      return {};
    } catch (error) {
      console.error('Error sending test email:', error);
      set(state => ({
        diagnostics: { ...state.diagnostics, testEmail: 'error' },
        diagnosticMessages: { ...state.diagnosticMessages, testEmail: 'Failed to send test email' }
      }));
      return { error: 'Failed to send test email' };
    }
  },
}));
