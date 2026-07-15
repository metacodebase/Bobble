import { Href, router, useLocalSearchParams } from 'expo-router';
import { Copy, Download, Pencil, Trash2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BobbleDetailSummary } from '@/src/components/bobbles/bobble-detail-summary';
import { BobbleDetailToolbar } from '@/src/components/bobbles/bobble-detail-toolbar';
import { BobbleInsights } from '@/src/components/bobbles/bobble-insights';
import { BobbleMindMap } from '@/src/components/bobbles/bobble-mind-map';
import { BobbleTranscript } from '@/src/components/bobbles/bobble-transcript';
import { CaptureHeader } from '@/src/components/capture/capture-header';
import { SegmentTabs, SummaryTab } from '@/src/components/capture/segment-tabs';
import { ActionSheet } from '@/src/components/ui/action-sheet';
import { ScreenLoading } from '@/src/components/ui/screen-loading';
import {
  bobbleDurationMin,
  formatBobbleDateLabel,
  formatTimestampLabel,
} from '@/src/features/bobbles/format';
import { useBobble, useDeleteBobble } from '@/src/hooks/bobbles';
import { useCaptureStore } from '@/src/store/capture-store';
import { Typography } from '@/src/theme/fonts';
import { toast } from '@/src/utils/toast';

export default function BobbleDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: bobble, isLoading, isError } = useBobble(id);
  const deleteBobble = useDeleteBobble();
  const [tab, setTab] = useState<SummaryTab>('summary');
  const [moreVisible, setMoreVisible] = useState(false);
  const recordingUri = useCaptureStore((state) => state.recordingUri);
  const recordingDurationSeconds = useCaptureStore((state) => state.recordingDurationSeconds);

  const title = bobble?.title ?? 'Bobble';
  const isTranscript = tab === 'transcript';
  const isMindMap = tab === 'mindmap';
  const isInsights = tab === 'insights';
  const showToolbar = !isTranscript && !isMindMap;

  const transcriptSegments = useMemo(() => {
    return (bobble?.transcriptSegments ?? []).map((segment) => ({
      id: segment.id,
      timestampSeconds: segment.timestampSeconds,
      timestampLabel: formatTimestampLabel(segment.timestampSeconds),
      text: segment.text,
    }));
  }, [bobble?.transcriptSegments]);

  const mindMapNodes = useMemo(() => {
    return (bobble?.mindMap?.nodes ?? []).map((node) => ({
      id: node.id,
      title: node.title,
      subtitle: node.subtitle,
      backgroundColor: node.backgroundColor ?? '#EDE9FE',
      lineColor: node.lineColor ?? '#C4B5FD',
      position: node.position,
    }));
  }, [bobble?.mindMap?.nodes]);

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
          if (!id || deleteBobble.isPending) return;
          deleteBobble.mutate(id, {
            onSuccess: () => {
              toast.success('Bobble deleted');
              router.back();
            },
          });
        },
      },
    ],
    [deleteBobble, id],
  );

  if (isLoading) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
        <CaptureHeader onBack={() => router.back()} />
        <ScreenLoading label="Loading bobble…" />
      </View>
    );
  }

  if (deleteBobble.isPending) {
    return (
      <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
        <CaptureHeader onBack={() => router.back()} />
        <ScreenLoading label="Deleting bobble…" />
      </View>
    );
  }

  if (isError || !bobble) {
    return (
      <View style={[styles.root, styles.centered, { paddingTop: insets.top + 8 }]}>
        <CaptureHeader onBack={() => router.back()} />
        <Text style={styles.errorText}>Bobble not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.headerBlock}>
        <CaptureHeader onBack={() => router.back()} rightIcon={Pencil} />
        <SegmentTabs active={tab} onChange={setTab} compact={isMindMap} />
      </View>

      {isTranscript ? (
        <BobbleTranscript
          segments={transcriptSegments}
          recordingUri={recordingUri ?? bobble.audioUrl}
          durationSeconds={
            recordingDurationSeconds > 0 ? recordingDurationSeconds : bobble.durationSec
          }
        />
      ) : isMindMap ? (
        <View style={styles.mindMapWrap}>
          <BobbleMindMap
            centerTitle={bobble.mindMap?.centerTitle ?? bobble.title}
            nodes={mindMapNodes.length > 0 ? mindMapNodes : undefined}
          />
        </View>
      ) : isInsights ? (
        <BobbleInsights
          title={bobble.insights?.title}
          items={bobble.insights?.items}
          reminder={bobble.insights?.reminder}
        />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <BobbleDetailSummary
            title={title}
            dateLabel={formatBobbleDateLabel(bobble.createdAt)}
            durationMin={bobbleDurationMin(bobble)}
            bullets={bobble.summary?.bullets}
          />
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
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
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
  errorText: {
    ...Typography.body,
    color: '#6B7280',
  },
});
