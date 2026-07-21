import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { profileApi } from '@/src/api';
import type { UpdateProfileBody, UploadAvatarBody } from '@/src/features/profile/types';
import { queryKeys } from '@/src/services/query-keys';
import { useAppStore } from '@/src/store/app-store';
import { getApiErrorMessage } from '@/src/utils/api-error';
import { resolveAvatarUrl } from '@/src/utils/avatar-url';
import { toast } from '@/src/utils/toast';

export function useProfile(enabled = true) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: queryKeys.profile.me,
    queryFn: profileApi.fetchProfile,
    enabled: enabled && isAuthenticated,
    staleTime: 60_000,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const setUser = useAppStore((s) => s.setUser);

  return useMutation({
    mutationFn: (body: UpdateProfileBody) => profileApi.updateProfile(body),
    onSuccess: (profile) => {
      qc.setQueryData(queryKeys.profile.me, profile);
      applyProfileUser(profile, setUser);
      syncAuthMeAvatar(qc, profile.user.avatarUrl);
      qc.invalidateQueries({ queryKey: queryKeys.auth.me });
      toast.success('Profile updated');
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Could not update profile')),
  });
}

function applyProfileUser(
  profile: Awaited<ReturnType<typeof profileApi.fetchProfile>>,
  setUser: ReturnType<typeof useAppStore.getState>['setUser'],
) {
  const current = useAppStore.getState().user;
  if (!current) return;
  setUser({
    ...current,
    name: profile.user.name,
    handle: profile.user.handle,
    avatarUrl: resolveAvatarUrl(profile.user.avatarUrl) ?? profile.user.avatarUrl,
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  const setUser = useAppStore((s) => s.setUser);

  return useMutation({
    mutationFn: (body: UploadAvatarBody) => profileApi.uploadAvatar(body),
    onSuccess: (profile) => {
      qc.setQueryData(queryKeys.profile.me, profile);
      applyProfileUser(profile, setUser);
      syncAuthMeAvatar(qc, profile.user.avatarUrl);
      useAppStore.getState().bumpAvatarCacheKey();
      qc.invalidateQueries({ queryKey: queryKeys.auth.me });
      toast.success('Profile photo updated');
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'Could not upload profile photo')),
  });
}

function syncAuthMeAvatar(
  qc: ReturnType<typeof useQueryClient>,
  avatarUrl?: string,
) {
  const resolved = resolveAvatarUrl(avatarUrl);
  qc.setQueryData(queryKeys.auth.me, (current: ReturnType<typeof useAppStore.getState>['user']) => {
    if (!current) return current;
    return { ...current, avatarUrl: resolved };
  });
}
