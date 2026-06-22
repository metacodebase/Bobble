import { Redirect } from 'expo-router';

import { useAppStore } from '@/src/store/app-store';

export default function Root() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);

  if (isAuthenticated || hasOnboarded) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
