import { API } from '@/src/api/endpoints';
import type {
  NotificationPreferences,
  RegisterPushDeviceBody,
  UnregisterPushDeviceBody,
  UpdateNotificationPreferencesBody,
} from '@/src/features/notifications/types';
import { api, unwrap } from '@/src/services/api';

export async function fetchNotificationPreferences(): Promise<NotificationPreferences> {
  const res = await api.get<NotificationPreferences>(API.notifications.preferences);
  return unwrap(res);
}

export async function updateNotificationPreferences(
  body: UpdateNotificationPreferencesBody,
): Promise<NotificationPreferences> {
  const res = await api.patch<NotificationPreferences, UpdateNotificationPreferencesBody>(
    API.notifications.preferences,
    body,
  );
  return unwrap(res);
}

export async function registerPushDevice(body: RegisterPushDeviceBody): Promise<void> {
  await api.post(API.notifications.devices, body);
}

export async function unregisterPushDevice(body: UnregisterPushDeviceBody): Promise<void> {
  await api.delete(API.notifications.devices, body);
}
