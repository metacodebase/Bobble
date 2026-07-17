import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'splash',
};

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      {/* Only declare screens that need custom options — file-based routes are auto-registered. */}
      <Stack.Screen name="splash" options={{ animation: 'none' }} />
    </Stack>
  );
}
