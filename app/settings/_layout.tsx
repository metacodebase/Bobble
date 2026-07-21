import { Stack } from 'expo-router';

import { AppBackground, useAppBackdrop } from '@/src/components/ui/app-background';

export default function SettingsLayout() {
  const { color } = useAppBackdrop();

  return (
    <Stack
      screenLayout={({ children }) => <AppBackground>{children}</AppBackground>}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: color },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="appearance" />
      <Stack.Screen name="account" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="calendar-sync" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="language" />
      <Stack.Screen name="help" />
      <Stack.Screen name="billing" />
      <Stack.Screen name="about" />
      <Stack.Screen name="export-data" />
    </Stack>
  );
}
