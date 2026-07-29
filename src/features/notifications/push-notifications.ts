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
let cachedTokenType: 'apns' | 'fcm' | null = null;
let handledNotificationKey: string | null = null;

function emitPushDebugLog(
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown>,
): void {
  fetch('http://127.0.0.1:7896/ingest/6498acde-96c3-4039-baac-430fa4cca5ac',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'814506'},body:JSON.stringify({sessionId:'814506',runId:'initial',hypothesisId,location,message,data,timestamp:Date.now()})}).catch(()=>{});
}

function notificationResponseKey(response: Notifications.NotificationResponse): string {
  const { identifier } = response.notification.request;
  return `${identifier}:${response.notification.date}`;
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

export async function getNativePushToken(): Promise<{ token: string; type: 'apns' | 'fcm' } | null> {
  if (!Device.isDevice) return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Bobble',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const result = await Notifications.getDevicePushTokenAsync();
  const type = Platform.OS === 'ios' ? 'apns' : 'fcm';
  const token = result.data as string;
  // #region agent log
  emitPushDebugLog('H3', 'push-notifications.ts:getNativePushToken:tokenSuccess', 'Native push token retrieved', {
    platform: Platform.OS,
    type,
    hasToken: Boolean(token),
  });
  // #endregion
  cachedPushToken = token;
  cachedTokenType = type;
  return { token, type };
}

export async function registerPushTokenWithBackend(token: string, tokenType: 'apns' | 'fcm'): Promise<void> {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;

  await registerPushDevice({
    token,
    platform: Platform.OS,
    tokenType,
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
  // #region agent log
  emitPushDebugLog('H1', 'push-notifications.ts:syncPushRegistration:start', 'Sync push registration started', {
    pushEnabled,
    platform: Platform.OS,
    isDevice: Device.isDevice,
  });
  // #endregion
  if (!pushEnabled) {
    await unregisterPushTokenFromBackend();
    return;
  }

  const granted = await requestNotificationPermissions();
  // #region agent log
  emitPushDebugLog('H2', 'push-notifications.ts:syncPushRegistration:permissionResult', 'Notification permission result', {
    granted,
  });
  // #endregion
  if (!granted) return;

  const result = await getNativePushToken();
  if (!result) return;

  try {
    await registerPushTokenWithBackend(result.token, result.type);
    // #region agent log
    emitPushDebugLog('H4', 'push-notifications.ts:syncPushRegistration:backendRegistered', 'Push token registered with backend', {
      tokenPrefix: result.token.slice(0, 12),
      tokenType: result.type,
      platform: Platform.OS,
    });
    // #endregion
  } catch (error) {
    // #region agent log
    emitPushDebugLog('H4', 'push-notifications.ts:syncPushRegistration:backendRegisterFailed', 'Push token registration failed', {
      errorMessage: error instanceof Error ? error.message : String(error),
      platform: Platform.OS,
    });
    // #endregion
    throw error;
  }
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

  const tokenSub = Notifications.addPushTokenListener(({ data, type }) => {
    const wasRegistered = cachedPushToken !== null;
    cachedPushToken = data as string;
    const tokenType = type === 'ios' ? 'apns' : 'fcm';
    cachedTokenType = tokenType;
    if (!wasRegistered) return;
    void registerPushTokenWithBackend(data as string, tokenType).catch((error) => {
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

export function getCachedTokenType(): 'apns' | 'fcm' | null {
  return cachedTokenType;
}
