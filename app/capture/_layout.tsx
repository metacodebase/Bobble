import { Stack } from 'expo-router';

export default function CaptureLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="record" />
      <Stack.Screen name="processing" />
      <Stack.Screen name="summary" />
      <Stack.Screen name="saved" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
