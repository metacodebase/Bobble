import { create, type StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { isDemoMode } from '@/src/config/backend';
import type { AuthSession, AuthUser } from '@/src/features/auth/types';
import { secureStorage } from '@/src/services/secure-storage';

interface AppState {
  authToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  hasOnboarded: boolean;
  hasHydrated: boolean;
  /** Explicit appearance; `null` follows the device light/dark setting. */
  themeOverride: 'light' | 'dark' | null;
  syncCalendarId: string | null;

  /** Bumped after avatar upload so the stable proxy URL refetches. */
  avatarCacheKey: number;

  setSession: (session: AuthSession) => void;
  continueAsGuest: () => void;
  setAuthToken: (token: string | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser | null) => void;
  setHasOnboarded: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
  setThemeOverride: (theme: 'light' | 'dark' | null) => void;
  setSyncCalendarId: (id: string | null) => void;
  bumpAvatarCacheKey: () => void;
  clearSession: () => void;
}

const APP_STORE_KEY = 'app-store';

const createAppState: StateCreator<AppState> = (set) => ({
  authToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isGuest: false,
  hasOnboarded: false,
  hasHydrated: isDemoMode,
  themeOverride: null,
  syncCalendarId: null,
  avatarCacheKey: 0,

  setSession: (session) =>
    set({
      authToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: session.user,
      isAuthenticated: true,
      isGuest: false,
    }),

  continueAsGuest: () =>
    set({
      authToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isGuest: true,
      hasOnboarded: true,
    }),

  setAuthToken: (token) =>
    set({
      authToken: token,
      isAuthenticated: token !== null,
      ...(token !== null ? { isGuest: false } : {}),
      ...(token === null ? { refreshToken: null, user: null } : {}),
    }),

  setTokens: (authToken, refreshToken) =>
    set({ authToken, refreshToken, isAuthenticated: true, isGuest: false }),

  setUser: (user) => set({ user }),

  setHasOnboarded: (value) => set({ hasOnboarded: value }),

  setHasHydrated: (value) => set({ hasHydrated: value }),

  setThemeOverride: (theme) => set({ themeOverride: theme }),

  setSyncCalendarId: (id) => set({ syncCalendarId: id }),

  bumpAvatarCacheKey: () => set({ avatarCacheKey: Date.now() }),

  clearSession: () =>
    set({
      authToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isGuest: false,
      avatarCacheKey: 0,
    }),
});

if (isDemoMode) {
  // Demo builds should never read or write persisted auth/onboarding state.
  void secureStorage.removeItem(APP_STORE_KEY);
}

export const useAppStore = isDemoMode
  ? create<AppState>()(createAppState)
  : create<AppState>()(
      persist(createAppState, {
        name: APP_STORE_KEY,
        version: 5,
        storage: createJSONStorage(() => secureStorage),
        migrate: (persistedState, version) => {
          const state = persistedState as Partial<AppState> & Record<string, unknown>;
          let next = { ...state };
          if (version < 2) {
            next = { ...next, hasOnboarded: false };
          }
          if (version < 3) {
            // Previous default forced light; only keep an explicit dark choice.
            const { nightBackground: _night, ...rest } = next;
            next = {
              ...rest,
              themeOverride: state.themeOverride === 'dark' ? 'dark' : null,
            };
          }
          if (version < 4) {
            next = { ...next, syncCalendarId: null };
          }
          if (version < 5) {
            next = { ...next, isGuest: false };
          }
          return next as AppState;
        },
        onRehydrateStorage: () => () => {
          useAppStore.setState({ hasHydrated: true });
        },
        partialize: (state) => ({
          authToken: state.authToken,
          refreshToken: state.refreshToken,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          isGuest: state.isGuest,
          hasOnboarded: state.hasOnboarded,
          themeOverride: state.themeOverride,
          syncCalendarId: state.syncCalendarId,
        }),
      })
    );
