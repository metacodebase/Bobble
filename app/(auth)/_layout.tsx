import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      initialRouteName="splash"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="splash" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="create-account" />
    </Stack>
  );
}
