import { Href, router, useLocalSearchParams } from 'expo-router';
import { Copy, Download, Pencil, Trash2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BobbleDetailSummary } from '@/src/components/bobbles/bobble-detail-summary';
import { BobbleDetailToolbar } from '@/src/components/bobbles/bobble-detail-toolbar';
import { CaptureHeader } from '@/src/components/capture/capture-header';
import { SegmentTabs, SummaryTab } from '@/src/components/capture/segment-tabs';
import { MindScoreCard, SummaryContent } from '@/src/components/capture/summary-content';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { ActionSheet } from '@/src/components/ui/action-sheet';
import { DEMO_BOBBLE_DETAIL, getBobbleById } from '@/src/data/demo-data';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';
import { toast } from '@/src/utils/toast';

export default function BobbleDetailScreen() {
  const colors = useBobbleColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const bobble = getBobbleById(id ?? '1');
  const [tab, setTab] = useState<SummaryTab>('summary');
  const [moreVisible, setMoreVisible] = useState(false);

  const title = bobble?.title ?? 'Bobble';

  const moreOptions = useMemo(
    () => [
      {
        id: 'rename',
        label: 'Rename Bobble',
        icon: Pencil,
        onPress: () => toast.success('Rename is coming soon'),
      },
      {
        id: 'duplicate',
        label: 'Duplicate Bobble',
        icon: Copy,
        onPress: () => toast.success('Bobble duplicated to your library'),
      },
      {
        id: 'export',
        label: 'Export Summary',
        icon: Download,
        onPress: () => toast.success('Summary exported'),
      },
      {
        id: 'delete',
        label: 'Delete Bobble',
        icon: Trash2,
        destructive: true,
        onPress: () => {
          toast.success('Bobble deleted');
          router.back();
        },
      },
    ],
    [],
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.headerBlock}>
        <CaptureHeader onBack={() => router.back()} rightIcon={Pencil} />
        <SegmentTabs active={tab} onChange={setTab} compact={tab === 'mindmap'} />
        {tab === 'mindmap' ? (
          <MindScoreCard score={DEMO_BOBBLE_DETAIL.mindScore} />
        ) : (
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {title}
          </Text>
        )}
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
          onAddTask={() => router.push('/(tabs)/tasks' as Href)}
          onPin={() => router.push('/(tabs)/bobbles' as Href)}
          onMore={() => setMoreVisible(true)}
        />
      </ScrollView>

      <ActionSheet
        visible={moreVisible}
        title={title}
        options={moreOptions}
        onClose={() => setMoreVisible(false)}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton
          label="Back to Home"
          onPress={() => router.replace('/(tabs)' as Href)}
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
    gap: 4,
  },
  title: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
    marginBottom: 8,
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
