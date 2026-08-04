import { GAMIFICATION, PROFILE_USER } from '@/src/data/demo-data';
import type { ProfilePayload, UpdateProfileBody } from '@/src/features/profile/types';
import { getGuestBobbleCount } from '@/src/services/offline/bobbles';
import { getGuestTaskCount } from '@/src/services/offline/tasks';
import { useAppStore } from '@/src/store/app-store';

function buildProfile(overrides: UpdateProfileBody = {}): ProfilePayload {
  const { isGuest, user: sessionUser } = useAppStore.getState();
  if (isGuest) {
    const bobbles = getGuestBobbleCount();
    const tasks = getGuestTaskCount();
    return {
      user: {
        _id: 'offline-guest-user',
        name: overrides.name ?? 'Guest',
        email: '',
        handle: overrides.handle,
        avatarUrl: overrides.avatarUrl,
        phone: overrides.phone,
        address: overrides.address,
      },
      gamification: {
        level: 1,
        title: 'Getting Started',
        xp: 0,
        streak: 0,
        bobbles,
        tasks,
        badges: [],
      },
      stats: { streak: 0, bobbles, tasks, xp: 0 },
    };
  }

  return {
    user: {
      _id: sessionUser?._id ?? 'offline-demo-user',
      name: overrides.name ?? sessionUser?.name ?? PROFILE_USER.name,
      email: sessionUser?.email ?? PROFILE_USER.email,
      handle: overrides.handle ?? sessionUser?.handle ?? PROFILE_USER.handle,
      avatarUrl: overrides.avatarUrl ?? sessionUser?.avatarUrl,
      phone: overrides.phone ?? sessionUser?.phone ?? PROFILE_USER.phone,
      address: overrides.address ?? sessionUser?.address ?? PROFILE_USER.address,
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
