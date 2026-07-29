export interface NotificationPreferences {
  pushEnabled: boolean;
  emailDigest: boolean;
  taskReminders: boolean;
  streakReminders: boolean;
}

export type UpdateNotificationPreferencesBody = Partial<NotificationPreferences>;

export type PushTokenType = 'apns' | 'fcm' | 'expo';

export interface RegisterPushDeviceBody {
  token: string;
  platform: 'ios' | 'android';
  tokenType: PushTokenType;
  deviceName?: string;
}

export interface UnregisterPushDeviceBody {
  token: string;
}
