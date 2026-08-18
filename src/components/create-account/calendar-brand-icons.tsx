import { Image } from 'expo-image';

export type CalendarProvider =
  | 'google'
  | 'apple'
  | 'outlook'
  | 'apple-reminders'
  | 'notion';

const PROVIDER_ICONS = {
  google: require('@/src/assets/images/calendar-sync/google-calendar.png'),
  apple: require('@/src/assets/images/calendar-sync/apple-calendar.webp'),
  outlook: require('@/src/assets/images/calendar-sync/outlook-calendar.png'),
  'apple-reminders': require('@/src/assets/images/calendar-sync/apple-reminders.webp'),
  notion: require('@/src/assets/images/calendar-sync/notion-calendar.png'),
} as const;

export function CalendarProviderIcon({
  provider,
  size = 24,
}: {
  provider: CalendarProvider;
  size?: number;
}) {
  return (
    <Image
      source={PROVIDER_ICONS[provider]}
      style={{ width: size, height: size }}
      contentFit="contain"
    />
  );
}
