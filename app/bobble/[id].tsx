import { Href, router, useLocalSearchParams } from 'expo-router';
import { Copy, Download, Pencil, Trash2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BobbleDetailSummary } from '@/src/components/bobbles/bobble-detail-summary';
import { BobbleDetailToolbar } from '@/src/components/bobbles/bobble-detail-toolbar';
import { BobbleInsights } from '@/src/components/bobbles/bobble-insights';
import { BobbleMindMap } from '@/src/components/bobbles/bobble-mind-map';
import { BobbleTranscript } from '@/src/components/bobbles/bobble-transcript';
import { CaptureHeader } from '@/src/components/capture/capture-header';
import { SegmentTabs, SummaryTab } from '@/src/components/capture/segment-tabs';
import { SummaryContent } from '@/src/components/capture/summary-content';
import { ActionSheet } from '@/src/components/ui/action-sheet';
import { DEMO_BOBBLE_DETAIL, getBobbleById } from '@/src/data/demo-data';
import { useCaptureStore } from '@/src/store/capture-store';
import { toast } from '@/src/utils/toast';

export default function BobbleDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const bobble = getBobbleById(id ?? '1');
  const [tab, setTab] = useState<SummaryTab>('summary');
  const [moreVisible, setMoreVisible] = useState(false);
  const recordingUri = useCaptureStore((state) => state.recordingUri);
  const recordingDurationSeconds = useCaptureStore((state) => state.recordingDurationSeconds);

  const title = bobble?.title ?? DEMO_BOBBLE_DETAIL.title;
  const isTranscript = tab === 'transcript';
  const isMindMap = tab === 'mindmap';
  const isInsights = tab === 'insights';
  const showToolbar = !isTranscript && !isMindMap;

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
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.headerBlock}>
        <CaptureHeader onBack={() => router.back()} rightIcon={Pencil} />
        <SegmentTabs active={tab} onChange={setTab} compact={isMindMap} />
      </View>

      {isTranscript ? (
        <BobbleTranscript
          recordingUri={recordingUri}
          durationSeconds={
            recordingDurationSeconds > 0
              ? recordingDurationSeconds
              : DEMO_BOBBLE_DETAIL.recordingDurationSeconds
          }
        />
      ) : isMindMap ? (
        <View style={styles.mindMapWrap}>
          <BobbleMindMap centerTitle={DEMO_BOBBLE_DETAIL.mindMapCenter} />
        </View>
      ) : isInsights ? (
        <BobbleInsights />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {tab === 'summary' ? (
            <BobbleDetailSummary
              title={title}
              dateLabel={bobble?.dateLabel}
              durationMin={bobble?.durationMin}
            />
          ) : (
            <SummaryContent tab={tab} />
          )}
        </ScrollView>
      )}

      {showToolbar ? (
        <BobbleDetailToolbar
          onShare={() => router.push({ pathname: '/share', params: { title } } as Href)}
          onAddTask={() => router.push('/(tabs)/tasks' as Href)}
          onPin={() => router.push('/(tabs)/bobbles' as Href)}
          onMore={() => setMoreVisible(true)}
        />
      ) : null}

      <ActionSheet
        visible={moreVisible}
        title={title}
        options={moreOptions}
        onClose={() => setMoreVisible(false)}
      />
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  mindMapWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
