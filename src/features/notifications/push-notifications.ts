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
let handledNotificationKey: string | null = null;

function notificationResponseKey(response: Notifications.NotificationResponse): string {
  const { identifier } = response.notification.request;
  return `${identifier}:${response.notification.date}`;
}

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
    if (typeof data.taskId === 'string') {
      router.push({ pathname: '/(tabs)/tasks', params: { taskId: data.taskId } } as Href);
    } else {
      router.push('/(tabs)/tasks' as Href);
    }
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
      '[push] Missing Expo project ID. Set EXPO_PUBLIC_EAS_PROJECT_ID in .env (Expo push tokens; not EAS Build).',
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

export function handleNotificationResponse(
  response: Notifications.NotificationResponse | null | undefined,
): void {
  if (!response) return;

  const key = notificationResponseKey(response);
  if (handledNotificationKey === key) return;
  handledNotificationKey = key;

  routeFromNotificationData(
    response.notification.request.content.data as Record<string, unknown>,
  );
}

export async function handleColdStartNotificationTap(): Promise<void> {
  const response = await Notifications.getLastNotificationResponseAsync();
  if (!response) return;

  // Android can return a stale last response on normal launches; only route recent taps.
  const ageMs = Date.now() - response.notification.date;
  if (ageMs > 10_000) return;

  handleNotificationResponse(response);
}

export function attachNotificationListeners(): () => void {
  const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
    handleNotificationResponse(response);
  });

  const tokenSub = Notifications.addPushTokenListener(({ data }) => {
    const wasRegistered = cachedPushToken !== null;
    cachedPushToken = data;
    if (!wasRegistered) return;
    void registerPushTokenWithBackend(data).catch((error) => {
      if (__DEV__) {
        console.warn('[push] token refresh registration failed', error);
      }
    });
  });

  return () => {
    responseSub.remove();
    tokenSub.remove();
  };
}

export function getCachedPushToken(): string | null {
  return cachedPushToken;
}
