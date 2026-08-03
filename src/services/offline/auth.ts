import { DEFAULT_SUBSCRIPTION } from '@/src/config/subscription';
import { GAMIFICATION, PROFILE_USER } from '@/src/data/demo-data';
import type {
  AuthSession,
  AuthUser,
  ChangePasswordBody,
  LoginBody,
  RegisterBody,
  RegisterResult,
  ResendVerificationBody,
  ResendVerificationResult,
  SocialAuthBody,
  VerifyEmailBody,
} from '@/src/features/auth/types';
import { useAppStore } from '@/src/store/app-store';

function buildDemoUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    _id: 'offline-demo-user',
    name: overrides.name ?? PROFILE_USER.name,
    email: overrides.email ?? PROFILE_USER.email,
    handle: overrides.handle ?? PROFILE_USER.handle.replace('@', ''),
    gamification: {
      level: GAMIFICATION.level,
      title: GAMIFICATION.title,
      xp: GAMIFICATION.currentXp,
      streak: GAMIFICATION.stats.streak,
      bobbles: GAMIFICATION.stats.bobbles,
      tasks: GAMIFICATION.stats.tasks,
      badges: GAMIFICATION.badges.map((badge) => ({
        label: badge.label,
        tone: badge.tone,
      })),
    },
    subscription: DEFAULT_SUBSCRIPTION,
    ...overrides,
  };
}

function buildSession(overrides: Partial<AuthUser> = {}): AuthSession {
  return {
    user: buildDemoUser(overrides),
    accessToken: 'offline-demo-access-token',
    refreshToken: 'offline-demo-refresh-token',
  };
}

export async function login(body: LoginBody): Promise<AuthSession> {
  const localPart = body.email.split('@')[0] ?? PROFILE_USER.name;
  return buildSession({
    email: body.email,
    name: localPart.charAt(0).toUpperCase() + localPart.slice(1),
    handle: localPart,
  });
}

export async function register(body: RegisterBody): Promise<RegisterResult> {
  return { email: body.email, expiresInSeconds: 600 };
}

export async function verifyEmail(body: VerifyEmailBody): Promise<AuthSession> {
  return buildSession({ email: body.email });
}

export async function resendVerification(
  _body: ResendVerificationBody
): Promise<ResendVerificationResult> {
  return { expiresInSeconds: 600, retryAfterSeconds: 60 };
}

export async function social(body: SocialAuthBody): Promise<AuthSession> {
  const name = body.name ?? PROFILE_USER.name;
  const handle = name.toLowerCase().replace(/\s+/g, '_');
  return buildSession({ name, handle });
}

export async function logout(): Promise<void> {
  /* no-op */
}

export async function fetchMe(): Promise<AuthUser> {
  const user = useAppStore.getState().user;
  return user ?? buildDemoUser();
}

export async function deleteAccount(): Promise<{ message: string }> {
  return { message: 'Account deleted' };
}

export async function changePassword(_body: ChangePasswordBody): Promise<{ message: string }> {
  return { message: 'Password updated' };
}
