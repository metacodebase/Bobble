import { API } from '@/src/api/endpoints';
import type {
  AuthSession,
  LoginBody,
  RegisterBody,
  SocialAuthBody,
} from '@/src/features/auth/types';
import type { AuthUser } from '@/src/features/auth/types';
import { api, unwrap } from '@/src/services/api';

export async function login(body: LoginBody): Promise<AuthSession> {
  const res = await api.post<AuthSession>(API.auth.login, body, { skipAuth: true });
  return unwrap(res);
}

export async function social(body: SocialAuthBody): Promise<AuthSession> {
  const res = await api.post<AuthSession>(API.auth.social, body, { skipAuth: true });
  return unwrap(res);
}

export async function register(body: RegisterBody): Promise<{ message: string }> {
  const res = await api.post<{ message: string }>(API.auth.register, body, { skipAuth: true });
  return unwrap(res);
}

export async function logout(): Promise<void> {
  await api.post(API.auth.logout, {});
}

export async function fetchMe(): Promise<AuthUser> {
  const res = await api.get<AuthUser>(API.auth.me);
  return unwrap(res);
}

export async function deleteAccount(): Promise<{ message: string }> {
  const res = await api.delete<{ message: string }>(API.auth.me);
  return unwrap(res);
}
