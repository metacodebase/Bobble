import { API } from '@/src/api/endpoints';
import { BACKEND_ALLOWED } from '@/src/config/backend';
import type { ProfilePayload, UpdateProfileBody } from '@/src/features/profile/types';
import { api, unwrap } from '@/src/services/api';
import { offlineProfile } from '@/src/services/offline';

export async function fetchProfile(): Promise<ProfilePayload> {
  if (!BACKEND_ALLOWED) return offlineProfile.fetchProfile();
  const res = await api.get<ProfilePayload>(API.profile.root);
  return unwrap(res);
}

export async function updateProfile(body: UpdateProfileBody): Promise<ProfilePayload> {
  if (!BACKEND_ALLOWED) return offlineProfile.updateProfile(body);
  const res = await api.patch<ProfilePayload, UpdateProfileBody>(API.profile.root, body);
  return unwrap(res);
}
