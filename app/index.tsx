import { Href, Redirect } from 'expo-router';

import { useAppStore } from '@/src/store/app-store';

export default function Root() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href={'/(auth)/splash' as Href} />;
}
