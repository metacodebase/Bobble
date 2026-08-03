import { API } from '@/src/api/endpoints';
import { BACKEND_ALLOWED } from '@/src/config/backend';
import type {
  AuthSession,
  AuthUser,
  ChangePasswordBody,
  LoginBody,
  RegisterBody,
  RequestSignupVerificationBody,
  ResendVerificationBody,
  ResendVerificationResult,
  SocialAuthBody,
  SignupVerificationResult,
  VerifyEmailBody,
  VerifySignupEmailBody,
  VerifySignupEmailResult,
} from '@/src/features/auth/types';
import { api, getApiBaseUrl, unwrap } from '@/src/services/api';
import { offlineAuth } from '@/src/services/offline';

export async function login(body: LoginBody): Promise<AuthSession> {
  if (!BACKEND_ALLOWED) return offlineAuth.login(body);
  const res = await api.post<AuthSession>(API.auth.login, body, { skipAuth: true });
  return unwrap(res);
}

/**
 * Social sign-in — must be POST /api/auth/social (GET returns 404).
 * Body: { provider: 'google' | 'apple', idToken: string, name?: string }
 */
export async function social(body: SocialAuthBody): Promise<AuthSession> {
  if (!BACKEND_ALLOWED) return offlineAuth.social(body);

  const payload: SocialAuthBody = {
    provider: body.provider,
    idToken: body.idToken,
    ...(body.name ? { name: body.name } : {}),
  };

  if (__DEV__) {
    console.log('[AuthAPI] POST', `${getApiBaseUrl()}${API.auth.social}`, {
      provider: payload.provider,
      idTokenLength: payload.idToken.length,
      name: payload.name,
    });
  }

  const res = await api.post<AuthSession>(API.auth.social, payload, { skipAuth: true });
  return unwrap(res);
}

export async function register(body: RegisterBody): Promise<AuthSession> {
  if (!BACKEND_ALLOWED) return offlineAuth.register(body);
  const res = await api.post<AuthSession>(API.auth.register, body, { skipAuth: true });
  return unwrap(res);
}

export async function requestSignupVerification(
  body: RequestSignupVerificationBody
): Promise<SignupVerificationResult> {
  if (!BACKEND_ALLOWED) return offlineAuth.requestSignupVerification(body);
  const res = await api.post<SignupVerificationResult>(API.auth.requestSignupVerification, body, {
    skipAuth: true,
  });
  return unwrap(res);
}

export async function verifySignupEmail(
  body: VerifySignupEmailBody
): Promise<VerifySignupEmailResult> {
  if (!BACKEND_ALLOWED) return offlineAuth.verifySignupEmail(body);
  const res = await api.post<VerifySignupEmailResult>(API.auth.verifySignupEmail, body, {
    skipAuth: true,
  });
  return unwrap(res);
}

export async function verifyEmail(body: VerifyEmailBody): Promise<AuthSession> {
  if (!BACKEND_ALLOWED) return offlineAuth.verifyEmail(body);
  const res = await api.post<AuthSession>(API.auth.verifyEmail, body, { skipAuth: true });
  return unwrap(res);
}

export async function resendVerification(
  body: ResendVerificationBody
): Promise<ResendVerificationResult> {
  if (!BACKEND_ALLOWED) return offlineAuth.resendVerification(body);
  const res = await api.post<ResendVerificationResult>(API.auth.resendVerification, body, {
    skipAuth: true,
  });
  return unwrap(res);
}

export async function logout(): Promise<void> {
  if (!BACKEND_ALLOWED) return offlineAuth.logout();
  await api.post(API.auth.logout, {});
}

export async function fetchMe(): Promise<AuthUser> {
  if (!BACKEND_ALLOWED) return offlineAuth.fetchMe();
  const res = await api.get<AuthUser>(API.auth.me);
  return unwrap(res);
}

/** Ask the backend to reconcile Pro from RevenueCat REST (after purchase/restore). */
export async function syncSubscription(): Promise<AuthUser> {
  if (!BACKEND_ALLOWED) return offlineAuth.fetchMe();
  const res = await api.post<AuthUser>(API.auth.syncSubscription, {});
  return unwrap(res);
}

export async function deleteAccount(): Promise<{ message: string }> {
  if (!BACKEND_ALLOWED) return offlineAuth.deleteAccount();
  const res = await api.delete<{ message: string }>(API.auth.me);
  return unwrap(res);
}

export async function changePassword(body: ChangePasswordBody): Promise<{ message: string }> {
  if (!BACKEND_ALLOWED) return offlineAuth.changePassword(body);
  const res = await api.post<{ message: string }, ChangePasswordBody>(
    API.auth.changePassword,
    body
  );
  return unwrap(res);
}
