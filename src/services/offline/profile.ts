import { GAMIFICATION, PROFILE_USER } from '@/src/data/demo-data';
import type { ProfilePayload, UpdateProfileBody } from '@/src/features/profile/types';
import { useAppStore } from '@/src/store/app-store';

function buildProfile(overrides: UpdateProfileBody = {}): ProfilePayload {
  const sessionUser = useAppStore.getState().user;
  return {
    user: {
      _id: sessionUser?._id ?? 'offline-demo-user',
      name: overrides.name ?? sessionUser?.name ?? PROFILE_USER.name,
      email: sessionUser?.email ?? PROFILE_USER.email,
      handle: overrides.handle ?? sessionUser?.handle ?? PROFILE_USER.handle,
      avatarUrl: overrides.avatarUrl ?? sessionUser?.avatarUrl,
    },
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
    stats: { ...GAMIFICATION.stats },
  };
}

export async function fetchProfile(): Promise<ProfilePayload> {
  return buildProfile();
}

export async function updateProfile(body: UpdateProfileBody): Promise<ProfilePayload> {
  return buildProfile(body);
}
