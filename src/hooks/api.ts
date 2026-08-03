import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Href, router } from 'expo-router';

import { authApi, systemApi } from '@/src/api';
import { unregisterPushTokenFromBackend } from '@/src/features/notifications/push-notifications';
import type {
  ChangePasswordBody,
  LoginBody,
  RegisterBody,
  ResendVerificationBody,
  SocialAuthBody,
  VerifyEmailBody,
} from '@/src/features/auth/types';
import type { ApiError } from '@/src/types/api';
import { queryKeys } from '@/src/services/query-keys';
import { loginPurchases, logoutPurchases } from '@/src/services/purchases';
import { clearTaskWidgets } from '@/src/services/widget-sync';
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
  const setUser = useAppStore((s) => s.setUser);
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const user = await authApi.fetchMe();
      setUser(user);
      return user;
    },
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
      void loginPurchases(session.user._id);
      router.replace('/(tabs)');
      toast.success('Welcome back!');
    },
    onError: (e, variables) => {
      if ((e as unknown as ApiError).code === 'EMAIL_NOT_VERIFIED') {
        router.push({
          pathname: '/(auth)/verify-email',
          params: { email: variables.email.trim().toLowerCase() },
        });
        toast.error('Enter the verification code sent to your email');
        return;
      }
      toast.error(getApiErrorMessage(e, 'Sign in failed'));
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (body: RegisterBody) => authApi.register(body),
    onError: (e) => toast.error(getApiErrorMessage(e, 'Registration failed')),
  });
}

export function useVerifyEmail() {
  const setSession = useAppStore((s) => s.setSession);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: VerifyEmailBody) => authApi.verifyEmail(body),
    onSuccess: (session) => {
      setSession(session);
      qc.setQueryData(queryKeys.auth.me, session.user);
      void loginPurchases(session.user._id);
      router.replace('/(tabs)');
      toast.success('Your email is verified. Welcome to Bobble!');
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Verification failed')),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (body: ResendVerificationBody) => authApi.resendVerification(body),
    onSuccess: () => toast.success('A new verification code was sent'),
    onError: (e) => toast.error(getApiErrorMessage(e, 'Could not resend code')),
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
      void loginPurchases(session.user._id);
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
        await unregisterPushTokenFromBackend();
      } catch {
        /* best effort */
      }
      try {
        await authApi.logout();
      } catch {
        /* clear locally regardless */
      }
      try {
        await logoutPurchases();
      } catch {
        /* best effort */
      }
    },
    onSettled: () => {
      clearSession();
      qc.clear();
      void clearTaskWidgets();
      router.replace('/(auth)/splash' as Href);
    },
  });
}

export function useDeleteAccount() {
  const clearSession = useAppStore((s) => s.clearSession);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        await unregisterPushTokenFromBackend();
      } catch {
        /* best effort */
      }
      return authApi.deleteAccount();
    },
    onSuccess: () => {
      clearSession();
      qc.clear();
      void clearTaskWidgets();
      void logoutPurchases();
      router.replace('/(auth)/splash' as Href);
      toast.success('Your account has been deleted');
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Could not delete account')),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (body: ChangePasswordBody) => authApi.changePassword(body),
    onSuccess: () => {
      toast.success('Password updated');
      router.back();
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Could not change password')),
  });
}
