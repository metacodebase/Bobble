import { Href, router, useLocalSearchParams } from 'expo-router';
import { Copy, Download, Pencil, Trash2 } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { androidSafeBottom, androidSafeTop } from '@/src/utils/safe-padding';

import { BobbleDetailSummary } from '@/src/components/bobbles/bobble-detail-summary';
import { BobbleDetailToolbar } from '@/src/components/bobbles/bobble-detail-toolbar';
import { BobbleInsights } from '@/src/components/bobbles/bobble-insights';
import { BobbleTranscript } from '@/src/components/bobbles/bobble-transcript';
import { RenameBobbleSheet } from '@/src/components/bobbles/rename-bobble-sheet';
import { CaptureHeader } from '@/src/components/capture/capture-header';
import { SegmentTabs, SummaryTab } from '@/src/components/capture/segment-tabs';
import { ActionSheet } from '@/src/components/ui/action-sheet';
import { ScreenLoading } from '@/src/components/ui/screen-loading';
import {
  bobbleDurationMin,
  formatBobbleDateLabel,
  formatTimestampLabel,
} from '@/src/features/bobbles/format';
import {
  useBobble,
  useCreateBobble,
  useDeleteBobble,
  useUpdateBobble,
} from '@/src/hooks/bobbles';
import { useBobbleToolbarActions } from '@/src/hooks/use-bobble-toolbar-actions';
import { useCaptureStore } from '@/src/store/capture-store';
import { Typography } from '@/src/theme/fonts';
import { buildDuplicateBobbleBody } from '@/src/utils/bobble-actions';
import { exportBobbleSummary } from '@/src/utils/export-bobble-summary';
import { toast } from '@/src/utils/toast';

export default function BobbleDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: bobble, isLoading, isError } = useBobble(id);
  const deleteBobble = useDeleteBobble();
  const updateBobble = useUpdateBobble();
  const createBobble = useCreateBobble();
  const { handleAddTasks, handlePin, isAddingTasks, isPinning } = useBobbleToolbarActions({
    bobbleId: id,
    bobble,
  });
  const [tab, setTab] = useState<SummaryTab>('summary');
  const [moreVisible, setMoreVisible] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);
  const recordingUri = useCaptureStore((state) => state.recordingUri);
  const recordingDurationSeconds = useCaptureStore((state) => state.recordingDurationSeconds);

  const title = bobble?.title ?? 'Bobble';
  const isTranscript = tab === 'transcript';
  const isInsights = tab === 'insights';
  const showToolbar = !isTranscript;
  const dateLabel = bobble ? formatBobbleDateLabel(bobble.createdAt) : undefined;
  const durationMin = bobble ? bobbleDurationMin(bobble) : undefined;

  const transcriptSegments = useMemo(() => {
    return (bobble?.transcriptSegments ?? []).map((segment) => ({
      id: segment.id,
      timestampSeconds: segment.timestampSeconds,
      timestampLabel: formatTimestampLabel(segment.timestampSeconds),
      text: segment.text,
    }));
  }, [bobble?.transcriptSegments]);

  const openRename = useCallback(() => {
    setRenameVisible(true);
  }, []);

  const handleRename = useCallback(
    (nextTitle: string) => {
      if (!id || updateBobble.isPending) return;
      updateBobble.mutate(
        { id, body: { title: nextTitle } },
        {
          onSuccess: () => {
            setRenameVisible(false);
            toast.success('Bobble renamed');
          },
        },
      );
    },
    [id, updateBobble],
  );

  const handleDuplicate = useCallback(() => {
    if (!bobble || createBobble.isPending) return;
    createBobble.mutate(buildDuplicateBobbleBody(bobble), {
      onSuccess: (created) => {
        toast.success('Bobble duplicated');
        router.push({ pathname: '/bobble/[id]', params: { id: created._id } } as Href);
      },
    });
  }, [bobble, createBobble]);

  const handleExportSummary = useCallback(async () => {
    if (!bobble) return;
    try {
      const result = await exportBobbleSummary(bobble, { dateLabel, durationMin });
      toast.success(result === 'shared' ? 'Summary exported' : 'Summary copied to clipboard');
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes('cancel')) return;
      toast.error('Could not export summary');
    }
  }, [bobble, dateLabel, durationMin]);

  const confirmDelete = useCallback(() => {
    if (!id || deleteBobble.isPending) return;
    Alert.alert(
      'Delete Bobble',
      'This will permanently delete this bobble. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteBobble.mutate(id, {
              onSuccess: () => {
                toast.success('Bobble deleted');
                router.back();
              },
            });
          },
        },
      ],
    );
  }, [deleteBobble, id]);

  const moreOptions = useMemo(
    () => [
      {
        id: 'rename',
        label: 'Rename Bobble',
        icon: Pencil,
        onPress: openRename,
      },
      {
        id: 'duplicate',
        label: 'Duplicate Bobble',
        icon: Copy,
        onPress: handleDuplicate,
      },
      {
        id: 'export',
        label: 'Export Summary',
        icon: Download,
        onPress: () => void handleExportSummary(),
      },
      {
        id: 'delete',
        label: 'Delete Bobble',
        icon: Trash2,
        destructive: true,
        onPress: confirmDelete,
      },
    ],
    [confirmDelete, handleDuplicate, handleExportSummary, openRename],
  );

  if (isLoading) {
    return (
      <View style={[styles.root, { paddingTop: androidSafeTop(insets.top) + 8 }]}>
        <CaptureHeader onBack={() => router.back()} safeTop={false} />
        <ScreenLoading label="Loading bobble…" />
      </View>
    );
  }

  if (deleteBobble.isPending) {
    return (
      <View style={[styles.root, { paddingTop: androidSafeTop(insets.top) + 8 }]}>
        <CaptureHeader onBack={() => router.back()} safeTop={false} />
        <ScreenLoading label="Deleting bobble…" />
      </View>
    );
  }

  if (isError || !bobble) {
    return (
      <View style={[styles.root, styles.centered, { paddingTop: androidSafeTop(insets.top) + 8 }]}>
        <CaptureHeader onBack={() => router.back()} safeTop={false} />
        <Text style={styles.errorText}>Bobble not found</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: androidSafeTop(insets.top) + 8,
          paddingBottom: androidSafeBottom(insets.bottom) + 16,
        },
      ]}>
      <View style={styles.headerBlock}>
        <CaptureHeader
          onBack={() => router.back()}
          rightIcon={Pencil}
          onRightPress={openRename}
          safeTop={false}
        />
        <SegmentTabs active={tab} onChange={setTab} />
      </View>

      {isTranscript ? (
        <BobbleTranscript
          bobbleId={bobble._id}
          segments={transcriptSegments}
          localRecordingUri={recordingUri}
          remoteAudioUrl={bobble.audioUrl}
          durationSeconds={
            recordingDurationSeconds > 0 ? recordingDurationSeconds : bobble.durationSec
          }
        />
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
            dateLabel={dateLabel}
            durationMin={durationMin}
            bullets={bobble.summary?.bullets}
            pinned={bobble.pinned}
          />
        </ScrollView>
      )}

      {showToolbar ? (
        <BobbleDetailToolbar
          onShare={() =>
            router.push({
              pathname: '/share',
              params: { bobbleId: id },
            } as Href)
          }
          onAddTask={handleAddTasks}
          onPin={handlePin}
          onMore={() => setMoreVisible(true)}
          disabled={isAddingTasks || isPinning}
          pinned={bobble.pinned}
        />
      ) : null}

      <ActionSheet
        visible={moreVisible}
        title={title}
        options={moreOptions}
        onClose={() => setMoreVisible(false)}
      />

      <RenameBobbleSheet
        visible={renameVisible}
        initialTitle={title}
        submitting={updateBobble.isPending}
        onClose={() => setRenameVisible(false)}
        onSubmit={handleRename}
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
  errorText: {
    ...Typography.body,
    color: '#6B7280',
  },
});
