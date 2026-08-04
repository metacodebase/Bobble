import { Href, Redirect } from 'expo-router';

import { useAppStore } from '@/src/store/app-store';

export default function Root() {
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isGuest = useAppStore((s) => s.isGuest);

  if (!hasHydrated) {
    return null;
  }

  if (isAuthenticated || isGuest) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href={'/(auth)/splash' as Href} />;
}
