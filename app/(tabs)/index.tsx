import { Href, router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DEMO_BOBBLE } from '@/src/components/capture/summary-content';
import { HomeHeader } from '@/src/components/home/home-header';
import { RecentBobbleRow } from '@/src/components/home/recent-bobble-row';
import { SecondaryButton } from '@/src/components/home/secondary-button';
import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const TAB_BAR_CLEARANCE = 100;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useBobbleColors();

  const startCapture = () => {
    router.push('/capture/record' as Href);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + TAB_BAR_CLEARANCE },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          greeting={getGreeting()}
          name="Steven"
          onProfilePress={() => router.push('/(tabs)/profile' as Href)}
        />

        <View style={styles.mascotWrap}>
          <BobbleMascot variant="sitting" size={300} />
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Start a Bobble" onPress={startCapture} style={styles.primaryButton} />
          <SecondaryButton label="Quick Capture" onPress={startCapture} />
        </View>

        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={[styles.recentTitle, { color: colors.text }]}>Recent Bobbles</Text>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </View>
          <RecentBobbleRow
            title={DEMO_BOBBLE.title}
            timestamp="Today 10:30 AM"
            onPress={() => router.push({ pathname: '/bobble/[id]', params: { id: '1' } } as Href)}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  mascotWrap: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  actions: {
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    width: '100%',
    alignSelf: 'stretch',
  },
  recentSection: {
    gap: 12,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentTitle: {
    ...Typography.formLabel,
    fontSize: 16,
    fontFamily: Typography.button.fontFamily,
  },
  seeAll: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
  },
});
