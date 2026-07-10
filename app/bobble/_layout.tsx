import { Stack } from 'expo-router';

import { AppBackground, useAppBackdrop } from '@/src/components/ui/app-background';

export default function BobbleLayout() {
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
      <Stack.Screen name="[id]" />
      <Stack.Screen name="continue" />
      <Stack.Screen name="updated" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
