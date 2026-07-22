export interface NotificationPreferences {
  pushEnabled: boolean;
  emailDigest: boolean;
  taskReminders: boolean;
  streakReminders: boolean;
}

export type UpdateNotificationPreferencesBody = Partial<NotificationPreferences>;

export interface RegisterPushDeviceBody {
  token: string;
  platform: 'ios' | 'android';
  deviceName?: string;
}

export interface UnregisterPushDeviceBody {
  token: string;
}
