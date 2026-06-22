import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AuthSession, AuthUser } from '@/src/features/auth/types';
import { secureStorage } from '@/src/services/secure-storage';

interface AppState {
  authToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasOnboarded: boolean;
  themeOverride: 'light' | 'dark' | null;

  setSession: (session: AuthSession) => void;
  setAuthToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  setHasOnboarded: (value: boolean) => void;
  setThemeOverride: (theme: 'light' | 'dark' | null) => void;
  clearSession: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      authToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      hasOnboarded: false,
      themeOverride: null,

      setSession: (session) =>
        set({
          authToken: session.accessToken,
          refreshToken: session.refreshToken,
          user: session.user,
          isAuthenticated: true,
        }),

      setAuthToken: (token) =>
        set({
          authToken: token,
          isAuthenticated: token !== null,
          ...(token === null ? { refreshToken: null, user: null } : {}),
        }),

      setUser: (user) => set({ user }),

      setHasOnboarded: (value) => set({ hasOnboarded: value }),

      setThemeOverride: (theme) => set({ themeOverride: theme }),

      clearSession: () =>
        set({
          authToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        authToken: state.authToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hasOnboarded: state.hasOnboarded,
        themeOverride: state.themeOverride,
      }),
    }
  )
);
