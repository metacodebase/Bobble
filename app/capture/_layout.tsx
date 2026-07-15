import { Stack } from 'expo-router';

import { AppBackground, useAppBackdrop } from '@/src/components/ui/app-background';

export default function CaptureLayout() {
  const { color } = useAppBackdrop();

  return (
    <AppBackground>
      <Stack
        screenLayout={({ children }) => <AppBackground>{children}</AppBackground>}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: color },
        }}
      >
        <Stack.Screen name="record" />
        <Stack.Screen name="processing" />
        <Stack.Screen name="summary" />
        <Stack.Screen name="saving" options={{ gestureEnabled: false }} />
        <Stack.Screen name="saved" options={{ gestureEnabled: false }} />
      </Stack>
    </AppBackground>
  );
}
