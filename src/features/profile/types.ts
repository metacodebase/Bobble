export interface ProfileUser {
  _id: string;
  name: string;
  email: string;
  handle?: string;
  avatarUrl?: string;
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
}
