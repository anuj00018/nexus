// ===================================================================
// Nexus Auth Store — Zustand
// Manages current user session state across the app
// Persists to localStorage for instant hydration on page load
// ===================================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isOnboarded: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setOnboarded: (done: boolean) => void;
  clearUser: () => void;
}

const DEFAULT_USER: User = {
  id: 'user-founder-anuj',
  email: 'anuj.vardham@nexus.app',
  name: 'Anuj Vardham',
  avatar_url: null,
  headline: 'Founder @ Nexus',

  linkedin_url: 'https://www.linkedin.com/in/anuj-vardham-b399253a1',
  skills: ['AI / ML', 'Product Strategy', 'Startup Growth', 'Networking'],
  role: 'attendee',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
} as any;


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isOnboarded: false,

      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      setOnboarded: (isOnboarded) => set({ isOnboarded }),
      clearUser: () => set({ user: null, isLoading: false, isOnboarded: false }),
    }),

    {
      name: 'nexus-auth',
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields — never persist isLoading
      partialize: (state) => ({
        user: state.user,
        isOnboarded: state.isOnboarded,
      }),
    }
  )
);
