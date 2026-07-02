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
  email: string;
  handle?: string;
  avatarUrl?: string;
  gamification?: Gamification;
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
}

export type SocialProvider = 'google' | 'apple';

export interface SocialAuthBody {
  provider: SocialProvider;
  idToken: string;
  /** Optional display name (Apple only returns it on first authorization). */
  name?: string;
}
