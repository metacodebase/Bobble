import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Href, router } from 'expo-router';

import { authApi, systemApi } from '@/src/api';
import type { LoginBody, RegisterBody, SocialAuthBody } from '@/src/features/auth/types';
import { queryKeys } from '@/src/services/query-keys';
import { useAppStore } from '@/src/store/app-store';
import { getApiErrorMessage } from '@/src/utils/api-error';
import { toast } from '@/src/utils/toast';

export function useHealth(enabled = true) {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: systemApi.fetchHealth,
    enabled,
    staleTime: 60_000,
    retry: 1,
  });
}

export function useMe(enabled = true) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.fetchMe,
    enabled: enabled && isAuthenticated,
    staleTime: 60_000,
  });
}

export function useLogin() {
  const setSession = useAppStore((s) => s.setSession);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: LoginBody) => authApi.login(body),
    onSuccess: (session) => {
      setSession(session);
      qc.setQueryData(queryKeys.auth.me, session.user);
      router.replace('/(tabs)');
      toast.success('Welcome back!');
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Sign in failed')),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (body: RegisterBody) => authApi.register(body),
    onError: (e) => toast.error(getApiErrorMessage(e, 'Registration failed')),
  });
}

export function useSocialLogin() {
  const setSession = useAppStore((s) => s.setSession);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: SocialAuthBody) => authApi.social(body),
    onSuccess: (session) => {
      setSession(session);
      qc.setQueryData(queryKeys.auth.me, session.user);
      router.replace('/(tabs)');
      toast.success('Welcome to Bobble!');
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Social sign-in failed')),
  });
}

export function useLogout() {
  const clearSession = useAppStore((s) => s.clearSession);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } catch {
        /* clear locally regardless */
      }
    },
    onSettled: () => {
      clearSession();
      qc.clear();
      router.replace('/(auth)/splash' as Href);
    },
  });
}
