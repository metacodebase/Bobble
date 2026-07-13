import { Href, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BobbleSaveLoading } from '@/src/components/capture/bobble-save-loading';
import { BobbleSaveSuccess } from '@/src/components/capture/bobble-save-success';
import { DEMO_BOBBLE } from '@/src/components/capture/summary-content';
import { useCreateTasksBulk } from '@/src/hooks/tasks';
import { useCaptureStore } from '@/src/store/capture-store';

const SAVE_MIN_MS = 2400;
const PROGRESS_TICK_MS = 40;

export default function SavingScreen() {
  const insets = useSafeAreaInsets();
  const pendingSave = useCaptureStore((state) => state.pendingBobbleSave);
  const clearPendingBobbleSave = useCaptureStore((state) => state.clearPendingBobbleSave);
  const clearRecording = useCaptureStore((state) => state.clearRecording);
  const createTasksBulk = useCreateTasksBulk();
  const [phase, setPhase] = useState<'saving' | 'saved'>('saving');
  const [progress, setProgress] = useState(0);
  const mutationSettledRef = useRef(false);

  const saveData = pendingSave ?? {
    title: DEMO_BOBBLE.title,
    dateLabel: 'Today, 11:30 AM',
    durationMin: 5,
    tasks: [] as { title: string }[],
  };

  useEffect(() => {
    const tasksToSave =
      useCaptureStore.getState().pendingBobbleSave?.tasks ?? saveData.tasks;
    const startedAt = Date.now();
    let finished = false;

    const tryFinish = () => {
      if (finished) return;

      const elapsed = Date.now() - startedAt;
      if (mutationSettledRef.current && elapsed >= SAVE_MIN_MS) {
        finished = true;
        setProgress(1);
        setPhase('saved');
      }
    };

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + 0.018, mutationSettledRef.current ? 1 : 0.92);
        return next;
      });
    }, PROGRESS_TICK_MS);

    const finishTimer = setInterval(tryFinish, 120);

    if (tasksToSave.length === 0) {
      mutationSettledRef.current = true;
    } else {
      createTasksBulk.mutate(
        { tasks: tasksToSave },
        {
          onSettled: () => {
            mutationSettledRef.current = true;
          },
        },
      );
    }

    return () => {
      clearInterval(progressTimer);
      clearInterval(finishTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run save flow once on mount
  }, []);

  const handleViewBobble = () => {
    clearPendingBobbleSave();
    clearRecording();
    router.replace({ pathname: '/bobble/[id]', params: { id: '1' } } as Href);
  };

  const handleHome = () => {
    clearPendingBobbleSave();
    clearRecording();
    router.replace('/(tabs)' as Href);
  };

  return (
    <View
      style={[
        styles.root,
      ]}
    >
      {phase === 'saving' ? (
        <BobbleSaveLoading progress={progress} />
      ) : (
        <BobbleSaveSuccess
          title={saveData.title}
          dateLabel={saveData.dateLabel}
          durationMin={saveData.durationMin}
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
});
