import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="appearance" />
      <Stack.Screen name="account" />
      <Stack.Screen name="calendar-sync" />
      <Stack.Screen name="connections" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="language" />
      <Stack.Screen name="help" />
      <Stack.Screen name="about" />
      <Stack.Screen name="export-data" />
    </Stack>
  );
}
