import type { UserSubscription } from '@/src/config/subscription';

export type BadgeTone = 'blue' | 'yellow' | 'green' | 'purple' | 'red';

export interface Badge {
  label: string;
  tone: BadgeTone;
  earnedAt?: string;
}

export interface Gamification {
  level: number;
  title: string;
  xp: number;
  streak: number;
  bobbles: number;
  tasks: number;
  badges: Badge[];
}

export interface AuthUser {
  _id: string;
  name: string;
  email?: string;
  handle?: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  gamification?: Gamification;
  subscription?: UserSubscription;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  emailVerificationToken: string;
}

export interface RequestSignupVerificationBody {
  name: string;
  email: string;
}

export interface SignupVerificationResult {
  email: string;
  expiresInSeconds: number;
  retryAfterSeconds: number;
}

export interface VerifySignupEmailBody {
  email: string;
  code: string;
}

export interface VerifySignupEmailResult {
  email: string;
  emailVerificationToken: string;
  verificationExpiresInSeconds: number;
}

export interface VerifyEmailBody {
  email: string;
  code: string;
}

export interface ResendVerificationBody {
  email: string;
}

export interface ResendVerificationResult {
  expiresInSeconds: number;
  retryAfterSeconds: number;
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

export type SocialProvider = 'google' | 'apple' | 'x';

export interface SocialAuthBody {
  provider: SocialProvider;
  /** ID token for Google/Apple, OAuth access token for X. */
  idToken: string;
  /** Optional display name (Apple only returns it on first authorization). */
  name?: string;
}
