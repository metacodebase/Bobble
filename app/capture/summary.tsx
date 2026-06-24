import { Href, router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pencil } from 'lucide-react-native';

import { CaptureHeader } from '@/src/components/capture/capture-header';
import { DEMO_BOBBLE, SummaryContent } from '@/src/components/capture/summary-content';
import { SegmentTabs, SummaryTab } from '@/src/components/capture/segment-tabs';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';

export default function SummaryScreen() {
  const colors = useBobbleColors();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<SummaryTab>('summary');

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, backgroundColor: colors.background }]}>
      <View style={styles.headerBlock}>
        <CaptureHeader
          title={DEMO_BOBBLE.title}
          onBack={() => router.back()}
          rightIcon={Pencil}
        />
        <SegmentTabs active={tab} onChange={setTab} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <SummaryContent tab={tab} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background }]}>
        <PrimaryButton
          label="Save Bobble"
          onPress={() => router.push('/capture/saved' as Href)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerBlock: {
    paddingBottom: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
  },
  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 0,
    paddingTop: 12,
  },
});
