import { useQueryClient } from '@tanstack/react-query';
import { Href, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { bobblesApi, tasksApi } from '@/src/api';
import { BobbleSaveLoading } from '@/src/components/capture/bobble-save-loading';
import { BobbleSaveSuccess } from '@/src/components/capture/bobble-save-success';
import { DEMO_BOBBLE } from '@/src/components/capture/summary-content';
import { categoryFromCaptureKind } from '@/src/features/bobbles/types';
import { queryKeys } from '@/src/services/query-keys';
import { useCaptureStore } from '@/src/store/capture-store';
import { getApiErrorMessage } from '@/src/utils/api-error';
import { toast } from '@/src/utils/toast';

const SAVE_MIN_MS = 2400;
const PROGRESS_TICK_MS = 40;

async function readRecordingAsBase64(
  uri: string,
): Promise<{ audioBase64: string; mimeType: string } | null> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const mimeType = blob.type || 'audio/m4a';
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    // eslint-disable-next-line no-undef -- btoa is available in RN / Hermes
    const audioBase64 = btoa(binary);
    return { audioBase64, mimeType };
  } catch {
    return null;
  }
}

export default function SavingScreen() {
  const pendingSave = useCaptureStore((state) => state.pendingBobbleSave);
  const clearPendingBobbleSave = useCaptureStore((state) => state.clearPendingBobbleSave);
  const clearRecording = useCaptureStore((state) => state.clearRecording);
  const recordingUri = useCaptureStore((state) => state.recordingUri);
  const qc = useQueryClient();
  const [phase, setPhase] = useState<'saving' | 'saved'>('saving');
  const [progress, setProgress] = useState(0);
  const [createdId, setCreatedId] = useState<string | null>(pendingSave?.createdBobbleId ?? null);
  const mutationSettledRef = useRef(false);

  const saveData = pendingSave ?? {
    title: DEMO_BOBBLE.title,
    dateLabel: 'Today, 11:30 AM',
    durationMin: 5,
    durationSec: 300,
    category: categoryFromCaptureKind('bobble'),
    tasks: [] as { title: string }[],
  };

  const [displayTitle, setDisplayTitle] = useState(saveData.title);

  useEffect(() => {
    const pending = useCaptureStore.getState().pendingBobbleSave;
    const payload = pending ?? saveData;
    const startedAt = Date.now();
    let finished = false;
    let cancelled = false;

    const tryFinish = () => {
      if (finished || cancelled) return;

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

    (async () => {
      try {
        const bobble = await bobblesApi.createBobble({
          title: payload.title,
          category: payload.category,
          durationSec: Math.max(0, Math.round(payload.durationSec ?? 0)),
          skipProcess: true,
        });

        if (cancelled) return;

        setCreatedId(bobble._id);
        useCaptureStore.getState().setPendingBobbleSave({
          ...payload,
          createdBobbleId: bobble._id,
        });

        let processed = bobble;
        const audio = recordingUri ? await readRecordingAsBase64(recordingUri) : null;
        if (audio?.audioBase64) {
          processed = await bobblesApi.uploadBobbleAudio(bobble._id, {
            ...audio,
            process: true,
          });
        } else {
          processed = await bobblesApi.processBobble(bobble._id);
        }

        if (cancelled) return;

        const successTitle = processed.title || payload.title;
        setDisplayTitle(successTitle);
        useCaptureStore.getState().setPendingBobbleSave({
          ...payload,
          title: successTitle,
          createdBobbleId: processed._id,
        });

        const aiTasks = (processed.suggestedTasks ?? [])
          .map((title) => title.trim())
          .filter(Boolean)
          .map((title) => ({ title }));

        // Prefer OpenAI-suggested tasks from the transcript; only fall back to
        // any client-side review tasks if the model returned none.
        const tasksToCreate = aiTasks.length > 0 ? aiTasks : payload.tasks;

        if (tasksToCreate.length > 0) {
          await tasksApi.createTasksBulk({
            bobble: processed._id,
            tasks: tasksToCreate.map((task) => ({ title: task.title })),
          });
        }

        await qc.invalidateQueries({ queryKey: queryKeys.bobbles.all });
        await qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
        await qc.invalidateQueries({ queryKey: queryKeys.auth.me });
        await qc.invalidateQueries({ queryKey: queryKeys.profile.all });
      } catch (error) {
        if (!cancelled) {
          toast.error(getApiErrorMessage(error, 'Could not save bobble'));
        }
      } finally {
        if (!cancelled) {
          mutationSettledRef.current = true;
        }
      }
    })();

    return () => {
      cancelled = true;
      clearInterval(progressTimer);
      clearInterval(finishTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run save flow once on mount
  }, []);

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

  return (
    <View style={styles.root}>
      {phase === 'saving' ? (
        <BobbleSaveLoading progress={progress} />
      ) : (
        <BobbleSaveSuccess
          title={displayTitle}
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
