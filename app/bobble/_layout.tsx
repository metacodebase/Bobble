import { Stack } from 'expo-router';

export default function BobbleLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="continue" />
      <Stack.Screen name="updated" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
