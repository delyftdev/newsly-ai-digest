
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  generatedEmail: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock data for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    generatedEmail: 'user1@newsletter-ai.com',
    createdAt: new Date().toISOString(),
  }
];

const generateUniqueEmail = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${random}${timestamp}@newsletter-ai.com`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isLoading: false });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user already exists
        const existingUser = mockUsers.find(u => u.email === email);
        if (existingUser) {
          set({ isLoading: false });
          return false;
        }

        // Create new user
        const newUser: User & { password: string } = {
          id: Date.now().toString(),
          name,
          email,
          password,
          generatedEmail: generateUniqueEmail(),
          createdAt: new Date().toISOString(),
        };

        mockUsers.push(newUser);
        
        const { password: _, ...userWithoutPassword } = newUser;
        set({ user: userWithoutPassword, isLoading: false });
        return true;
      },

      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
