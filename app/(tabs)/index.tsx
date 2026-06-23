import { Href, router } from 'expo-router';
import { Mic } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DEMO_BOBBLE } from '@/src/components/capture/summary-content';
import { RecentBobbleRow } from '@/src/components/home/recent-bobble-row';
import { SecondaryButton } from '@/src/components/home/secondary-button';
import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const startCapture = () => {
    router.push('/capture/record' as Href);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>{getGreeting()}, Steven 👋</Text>

        <View style={styles.mascotWrap}>
          <BobbleMascot variant="sitting" size={220} />
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            label="+ Start a Bobble"
            onPress={startCapture}
            style={styles.primaryButton}
          />
          <SecondaryButton label="Quick Capture" icon={Mic} onPress={startCapture} />
        </View>

        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent Bobbles</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>
          <RecentBobbleRow
            title={DEMO_BOBBLE.title}
            timestamp="Today, 11:30 AM"
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
    backgroundColor: BobbleColors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  greeting: {
    ...Typography.heading,
    fontSize: 28,
    lineHeight: 36,
    color: BobbleColors.text,
    marginBottom: 8,
  },
  mascotWrap: {
    alignItems: 'center',
    marginVertical: 12,
  },
  actions: {
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    gap: 4,
    width: '100%',
  },
  recentSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BobbleColors.border,
    paddingTop: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  recentTitle: {
    ...Typography.formLabel,
    fontSize: 16,
    color: BobbleColors.text,
  },
  seeAll: {
    ...Typography.caption,
    color: BobbleColors.primary,
    fontFamily: Typography.button.fontFamily,
  },
});
