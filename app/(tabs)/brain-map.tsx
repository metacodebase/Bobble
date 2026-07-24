import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/src/components/ui/screen-header';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { useTabBarInsets } from '@/src/hooks/use-tab-bar-insets';
import { Typography } from '@/src/theme/fonts';

const MINDMAP_ICON = require('@/src/assets/images/tab-icons/mindmap-active.png');

export default function BrainMapScreen() {
  const insets = useSafeAreaInsets();
  const colors = useBobbleColors();
  const night = useNightForeground();
  const { height: tabBarHeight } = useTabBarInsets();

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 8,
          paddingBottom: tabBarHeight + 16,
        },
      ]}
    >
      <ScreenHeader title="Brain Map" />

      <View style={styles.empty}>
        <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
          <Image source={MINDMAP_ICON} style={styles.icon} contentFit="contain" />
        </View>
        <Text style={[styles.title, { color: night.text ?? colors.text }]}>Your Brain Map</Text>
        <Text style={[styles.subtitle, { color: night.textSecondary ?? colors.textSecondary }]}>
          Connect ideas, themes, and insights from your Bobbles. Maps will show up here soon.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 40,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  icon: {
    width: 44,
    height: 44,
  },
  title: {
    ...Typography.heading,
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 280,
  },
});
