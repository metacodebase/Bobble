import { Href, Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useAppStore } from '@/src/store/app-store';
import { BobbleColors } from '@/src/theme/colors';

export default function Root() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const hasHydrated = useAppStore((s) => s.hasHydrated);

  if (!hasHydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: BobbleColors.background }}>
        <ActivityIndicator color={BobbleColors.primary} />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href={'/(auth)/splash' as Href} />;
}
