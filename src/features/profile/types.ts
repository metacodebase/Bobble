import type { UserSubscription } from '@/src/config/subscription';

export interface ProfileUser {
  _id: string;
  name: string;
  email?: string;
  handle?: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  subscription?: UserSubscription;
}

export interface ProfilePayload {
  user: ProfileUser;
  gamification: {
    level: number;
    title: string;
    xp: number;
    streak: number;
    bobbles: number;
    tasks: number;
    badges: { label: string; tone: string; earnedAt?: string }[];
  };
  stats: {
    streak: number;
    bobbles: number;
    tasks: number;
    xp: number;
  };
}

export interface UpdateProfileBody {
  name?: string;
  handle?: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
}

export interface UploadAvatarBody {
  imageBase64: string;
  mimeType?: string;
}
