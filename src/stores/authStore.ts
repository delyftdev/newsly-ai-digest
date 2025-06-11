
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  // Add aliases for backward compatibility
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user ?? null, isLoading: false });

      supabase.auth.onAuthStateChange(async (event, session) => {
        set({ user: session?.user ?? null });
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if onboarding is complete
          const { data: progress } = await supabase
            .from('onboarding_progress')
            .select('completed_at')
            .eq('user_id', session.user.id)
            .single();
          
          // If no onboarding progress or not completed, redirect to onboarding
          if (!progress?.completed_at) {
            window.location.href = '/onboarding';
          } else {
            window.location.href = '/dashboard';
          }
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      set({ user: null });
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  },

  // Backward compatibility aliases
  signup: async (name: string, email: string, password: string) => {
    return get().signUp(email, password, name);
  },

  login: async (email: string, password: string) => {
    return get().signIn(email, password);
  },

  logout: async () => {
    return get().signOut();
  },
}));
