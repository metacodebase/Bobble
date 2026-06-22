import { Href, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pencil } from 'lucide-react-native';

import { BobbleDetailSummary } from '@/src/components/bobbles/bobble-detail-summary';
import { BobbleDetailToolbar } from '@/src/components/bobbles/bobble-detail-toolbar';
import { CaptureHeader } from '@/src/components/capture/capture-header';
import { SummaryContent } from '@/src/components/capture/summary-content';
import { SegmentTabs, SummaryTab } from '@/src/components/capture/segment-tabs';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { getBobbleById } from '@/src/data/demo-data';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';
import { toast } from '@/src/utils/toast';

export default function BobbleDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const bobble = getBobbleById(id ?? '1');
  const [tab, setTab] = useState<SummaryTab>('summary');

  const title = bobble?.title ?? 'Bobble';

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.headerBlock}>
        <CaptureHeader
          title={title}
          onBack={() => router.back()}
          rightIcon={Pencil}
          onRightPress={() => toast.info('Edit title coming soon')}
        />
        <SegmentTabs active={tab} onChange={setTab} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'summary' ? (
          <BobbleDetailSummary
            dateLabel={bobble?.dateLabel}
            durationMin={bobble?.durationMin}
          />
        ) : (
          <SummaryContent tab={tab} />
        )}

        <BobbleDetailToolbar
          onShare={() => router.push({ pathname: '/share', params: { title } } as Href)}
          onAddTask={() => toast.info('Add task coming soon')}
          onPin={() => toast.info('Pinned')}
          onMore={() => toast.info('More options coming soon')}
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton
          label="Continue Bobbling"
          onPress={() => router.push({ pathname: '/bobble/continue', params: { id: id ?? '1' } } as Href)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BobbleColors.background,
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
    backgroundColor: BobbleColors.background,
  },
});
