import { Image } from 'expo-image';
import { Href, router } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MindMapClusterView } from '@/src/components/brain-map/mind-map-cluster';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { ScreenHeader } from '@/src/components/ui/screen-header';
import { ScreenLoading } from '@/src/components/ui/screen-loading';
import { useMindMapClusters } from '@/src/hooks/mind-map';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { useIsPro } from '@/src/hooks/use-subscription';
import { useTabBarInsets } from '@/src/hooks/use-tab-bar-insets';
import { Typography } from '@/src/theme/fonts';

const MINDMAP_ICON = require('@/src/assets/images/tab-icons/mindmap-active.png');

export default function BrainMapScreen() {
  const insets = useSafeAreaInsets();
  const colors = useBobbleColors();
  const night = useNightForeground();
  const { height: tabBarHeight } = useTabBarInsets();
  const isPro = useIsPro();
  const { data: clusters, isLoading, isRefetching, refetch } = useMindMapClusters(isPro);

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 8,
          paddingBottom: tabBarHeight + 8,
        },
      ]}
    >
      <ScreenHeader title="Brain Map" />

      {!isPro ? (
        <View style={styles.empty}>
          <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
            <Image source={MINDMAP_ICON} style={styles.icon} contentFit="contain" />
          </View>
          <Text style={[styles.title, { color: night.text ?? colors.text }]}>
            Mind Maps & Insights
          </Text>
          <Text style={[styles.subtitle, { color: night.textSecondary ?? colors.textSecondary }]}>
            Upgrade to Bobble Pro to unlock mind maps and deeper insights from your captures.
          </Text>
          <PrimaryButton
            label="Unlock Bobble Pro"
            onPress={() => router.push('/paywall' as Href)}
            style={styles.cta}
            showChevron={false}
          />
        </View>
      ) : isLoading ? (
        <ScreenLoading label="Loading your brain map…" />
      ) : !clusters?.length ? (
        <View style={styles.empty}>
          <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
            <Image source={MINDMAP_ICON} style={styles.icon} contentFit="contain" />
          </View>
          <Text style={[styles.title, { color: night.text ?? colors.text }]}>Your Brain Map</Text>
          <Text style={[styles.subtitle, { color: night.textSecondary ?? colors.textSecondary }]}>
            Create tasks from a Bobble to grow your map. Each capture day becomes a node with its
            tasks around it.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isLoading}
              onRefresh={() => void refetch()}
              tintColor={colors.primary}
            />
          }
        >
          {clusters.map((cluster, index) => (
            <MindMapClusterView
              key={cluster._id}
              cluster={cluster}
              showConnectorBelow={index < clusters.length - 1}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 24,
    gap: 4,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 40,
    paddingHorizontal: 8,
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
    maxWidth: 300,
  },
  cta: {
    marginTop: 8,
    minWidth: 220,
  },
});
