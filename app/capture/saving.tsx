import { useQueryClient } from '@tanstack/react-query';
import { Href, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BobbleSaveLoading } from '@/src/components/capture/bobble-save-loading';
import { BobbleSaveSuccess } from '@/src/components/capture/bobble-save-success';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { DEMO_BOBBLE } from '@/src/components/capture/summary-content';
import { DEFAULT_BOBBLE_CATEGORY } from '@/src/features/bobbles/types';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { queryKeys } from '@/src/services/query-keys';
import { useCaptureStore } from '@/src/store/capture-store';
import { Typography } from '@/src/theme/fonts';

const SAVE_MIN_MS = 1800;
const PROGRESS_TICK_MS = 40;

export default function SavingScreen() {
  const colors = useBobbleColors();
  const night = useNightForeground();
  const insets = useSafeAreaInsets();
  const pendingSave = useCaptureStore((state) => state.pendingBobbleSave);
  const clearPendingBobbleSave = useCaptureStore((state) => state.clearPendingBobbleSave);
  const clearRecording = useCaptureStore((state) => state.clearRecording);
  const qc = useQueryClient();
  const [phase, setPhase] = useState<'saving' | 'saved' | 'error'>('saving');
  const [progress, setProgress] = useState(0);
  const [createdId, setCreatedId] = useState<string | null>(pendingSave?.createdBobbleId ?? null);
  const settledRef = useRef(false);

  const saveData = pendingSave ?? {
    title: DEMO_BOBBLE.title,
    dateLabel: 'Today, 11:30 AM',
    durationMin: 5,
    durationSec: 300,
    category: DEFAULT_BOBBLE_CATEGORY,
    tasks: [] as { title: string }[],
  };

  const displayTitle = pendingSave?.title ?? saveData.title;

  useEffect(() => {
    const pending = useCaptureStore.getState().pendingBobbleSave;
    const startedAt = Date.now();
    let finished = false;
    let cancelled = false;
    settledRef.current = false;
    setPhase('saving');
    setProgress(0);

    const bobbleId = pending?.createdBobbleId ?? null;
    setCreatedId(bobbleId);

    if (!bobbleId) {
      setPhase('error');
      return;
    }

    const tryFinish = () => {
      if (finished || cancelled) return;
      if (!settledRef.current) return;

      const elapsed = Date.now() - startedAt;
      if (elapsed < SAVE_MIN_MS) return;

      finished = true;
      setProgress(1);
      setPhase('saved');
    };

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + 0.028, settledRef.current ? 1 : 0.92));
    }, PROGRESS_TICK_MS);

    const finishTimer = setInterval(tryFinish, 120);

    (async () => {
      try {
        await qc.invalidateQueries({ queryKey: queryKeys.bobbles.all });
        await qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
        await qc.invalidateQueries({ queryKey: queryKeys.auth.me });
        await qc.invalidateQueries({ queryKey: queryKeys.profile.all });
      } finally {
        if (!cancelled) {
          settledRef.current = true;
        }
      }
    })();

    return () => {
      cancelled = true;
      clearInterval(progressTimer);
      clearInterval(finishTimer);
    };
  }, [qc]);

  const handleViewBobble = () => {
    const id = createdId ?? useCaptureStore.getState().pendingBobbleSave?.createdBobbleId;
    clearPendingBobbleSave();
    clearRecording();
    if (id) {
      router.replace({ pathname: '/bobble/[id]', params: { id } } as Href);
      return;
    }
    router.replace('/(tabs)/bobbles' as Href);
  };

  const handleHome = () => {
    clearPendingBobbleSave();
    clearRecording();
    router.replace('/(tabs)' as Href);
  };

  if (phase === 'error') {
    return (
      <View
        style={[
          styles.root,
          styles.errorRoot,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          },
        ]}
      >
        <Text style={[styles.errorTitle, { color: night.text ?? colors.text }]}>
          Nothing to save
        </Text>
        <Text style={[styles.errorBody, { color: night.textSecondary ?? colors.textSecondary }]}>
          Process and review your recording first, then save the bobble.
        </Text>
        <PrimaryButton
          label="Back to home"
          onPress={handleHome}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {phase === 'saving' ? (
        <BobbleSaveLoading progress={progress} stageLabel="Finishing up…" />
      ) : (
        <BobbleSaveSuccess
          title={displayTitle}
          dateLabel={saveData.dateLabel}
          durationMin={saveData.durationMin}
          category={saveData.category}
          tasks={saveData.tasks}
          bobbleId={createdId ?? undefined}
          onViewBobble={handleViewBobble}
          onHome={handleHome}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
  },
  errorRoot: {
    justifyContent: 'center',
    gap: 16,
  },
  errorTitle: {
    ...Typography.heading,
    fontSize: 24,
    textAlign: 'center',
  },
  errorBody: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
