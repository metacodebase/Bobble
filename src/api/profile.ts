import { API } from '@/src/api/endpoints';
import type { ProfilePayload, UpdateProfileBody, UploadAvatarBody } from '@/src/features/profile/types';
import { api, unwrap } from '@/src/services/api';
import { offlineProfile } from '@/src/services/offline';
import { shouldUseOfflineData } from '@/src/services/offline/mode';

export async function fetchProfile(): Promise<ProfilePayload> {
  if (shouldUseOfflineData()) return offlineProfile.fetchProfile();
  const res = await api.get<ProfilePayload>(API.profile.root);
  return unwrap(res);
}

export async function updateProfile(body: UpdateProfileBody): Promise<ProfilePayload> {
  if (shouldUseOfflineData()) return offlineProfile.updateProfile(body);
  const res = await api.patch<ProfilePayload, UpdateProfileBody>(API.profile.root, body);
  return unwrap(res);
}

export async function uploadAvatar(body: UploadAvatarBody): Promise<ProfilePayload> {
  if (shouldUseOfflineData()) return offlineProfile.updateProfile({ avatarUrl: body.imageBase64 });
  const res = await api.post<ProfilePayload, UploadAvatarBody>(API.profile.avatar, body);
  return unwrap(res);
}
