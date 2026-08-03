import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import {
  fetchNotificationPreferences,
  updateNotificationPreferences,
} from '@/src/api/notifications';
import type {
  NotificationPreferences,
  UpdateNotificationPreferencesBody,
} from '@/src/features/notifications/types';
import {
  attachNotificationListeners,
  handleColdStartNotificationTap,
  syncPushRegistration,
} from '@/src/features/notifications/push-notifications';
import { queryKeys } from '@/src/services/query-keys';
import { useAppStore } from '@/src/store/app-store';
import { getApiErrorMessage } from '@/src/utils/api-error';
import { toast } from '@/src/utils/toast';

export function useNotificationPreferences(enabled = true) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: queryKeys.notifications.preferences,
    queryFn: fetchNotificationPreferences,
    enabled: enabled && isAuthenticated,
    staleTime: 60_000,
  });
}

export function useUpdateNotificationPreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateNotificationPreferencesBody) => updateNotificationPreferences(body),
    onSuccess: async (preferences: NotificationPreferences) => {
      qc.setQueryData(queryKeys.notifications.preferences, preferences);
      try {
        await syncPushRegistration(preferences.pushEnabled);
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'Could not update push registration'));
      }
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, 'Could not update notification settings')),
  });
}

export function usePushNotificationsBootstrap(enabled = true) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const preferences = useNotificationPreferences(enabled && isAuthenticated);

  useEffect(() => {
    if (!enabled || !isAuthenticated || !preferences.data?.pushEnabled) return;

    void syncPushRegistration(true).catch((error) => {
      if (__DEV__) {
        console.warn('[push] registration failed', error);
      }
    });
  }, [enabled, isAuthenticated, preferences.data?.pushEnabled]);

  useEffect(() => {
    if (!enabled || !isAuthenticated) return;
    return attachNotificationListeners();
  }, [enabled, isAuthenticated]);

  useEffect(() => {
    if (!enabled || !isAuthenticated) return;

    void handleColdStartNotificationTap().catch((error) => {
      if (__DEV__) {
        console.warn('[push] cold-start notification routing failed', error);
      }
    });
  }, [enabled, isAuthenticated]);
}
