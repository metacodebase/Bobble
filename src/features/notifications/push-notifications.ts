import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Href, router } from 'expo-router';
import { Platform } from 'react-native';

import {
  fetchNotificationPreferences,
  registerPushDevice,
  unregisterPushDevice,
  updateNotificationPreferences,
} from '@/src/api/notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let cachedPushToken: string | null = null;

function getEasProjectId(): string | undefined {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    process.env.EXPO_PUBLIC_EAS_PROJECT_ID
  );
}

function routeFromNotificationData(data: Record<string, unknown> | undefined): void {
  if (!data) return;
  if (data.type === 'task_reminder') {
    router.push('/(tabs)/tasks' as Href);
    return;
  }
  if (data.type === 'streak_reminder') {
    router.push('/capture/record' as Href);
    return;
  }
  if (typeof data.bobbleId === 'string') {
    router.push({ pathname: '/bobble/[id]', params: { id: data.bobbleId } } as Href);
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });
  return requested.granted;
}

export async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const projectId = getEasProjectId();
  if (!projectId) {
    console.warn(
      '[push] Missing EAS project ID. Run `eas init` and set EXPO_PUBLIC_EAS_PROJECT_ID.',
    );
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Bobble',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  cachedPushToken = token.data;
  return token.data;
}

export async function registerPushTokenWithBackend(token: string): Promise<void> {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;

  await registerPushDevice({
    token,
    platform: Platform.OS,
    deviceName: Device.modelName ?? undefined,
  });
}

export async function unregisterPushTokenFromBackend(): Promise<void> {
  if (!cachedPushToken) return;
  try {
    await unregisterPushDevice({ token: cachedPushToken });
  } catch {
    /* best effort */
  } finally {
    cachedPushToken = null;
  }
}

export async function syncPushRegistration(pushEnabled: boolean): Promise<void> {
  if (!pushEnabled) {
    await unregisterPushTokenFromBackend();
    return;
  }

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  const token = await getExpoPushToken();
  if (!token) return;

  await registerPushTokenWithBackend(token);
}

export function attachNotificationListeners(): () => void {
  const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
    routeFromNotificationData(response.notification.request.content.data as Record<string, unknown>);
  });

  return () => {
    responseSub.remove();
  };
}

export function getCachedPushToken(): string | null {
  return cachedPushToken;
}
