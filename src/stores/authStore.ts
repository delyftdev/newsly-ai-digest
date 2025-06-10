
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,

      initialize: async () => {
        try {
          // Set up auth state listener
          supabase.auth.onAuthStateChange(
            async (event, session) => {
              console.log('Auth state changed:', event, session?.user?.id);
              set({ 
                session, 
                user: session?.user ?? null, 
                isLoading: false 
              });
            }
          );

          // Get initial session
          const { data: { session } } = await supabase.auth.getSession();
          set({ 
            session, 
            user: session?.user ?? null, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ isLoading: false });
            return { error: error.message };
          }

          set({ 
            user: data.user, 
            session: data.session, 
            isLoading: false 
          });
          return {};
        } catch (error) {
          set({ isLoading: false });
          return { error: 'An unexpected error occurred' };
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                full_name: name,
                company_name: `${name}'s Company`,
              },
            },
          });

          if (error) {
            set({ isLoading: false });
            return { error: error.message };
          }

          set({ isLoading: false });
          return {};
        } catch (error) {
          set({ isLoading: false });
          return { error: 'An unexpected error occurred' };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await supabase.auth.signOut();
          set({ user: null, session: null, isLoading: false });
        } catch (error) {
          console.error('Logout error:', error);
          set({ isLoading: false });
        }
      },

      resetPassword: async (email: string) => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });

          if (error) {
            return { error: error.message };
          }

          return {};
        } catch (error) {
          return { error: 'An unexpected error occurred' };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, session: state.session }),
    }
  )
);
