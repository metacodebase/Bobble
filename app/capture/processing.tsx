import { Image } from 'expo-image';
import { Href, router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bobblesApi } from '@/src/api';
import { CaptureHeader } from '@/src/components/capture/capture-header';
import { ProcessingChecklist } from '@/src/components/capture/processing-checklist';
import { RecordingPlaybackBar } from '@/src/components/capture/recording-playback-bar';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { formatBobbleDateLabel } from '@/src/features/bobbles/format';
import { categoryFromCaptureKind } from '@/src/features/bobbles/types';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { CAPTURE_COPY, useCaptureStore } from '@/src/store/capture-store';
import { getApiErrorMessage, logApiError } from '@/src/utils/api-error';
import { readRecordingAsBase64 } from '@/src/utils/recording-base64';
import { Typography } from '@/src/theme/fonts';

const PROCESSING_MASCOT = require('@/src/assets/images/bobble-dualSound.png');

const STEPS = [
  { id: 'create', label: 'Creating your Bobble...', icon: 'bobble' },
  { id: 'upload', label: 'Uploading your recording...', icon: 'list' },
  { id: 'listen', label: 'Listening to your Bobble...', icon: 'ear' },
  { id: 'points', label: 'Finding the key points...', icon: 'lightbulb' },
] as const;

type ProcessPhase = 'running' | 'ready' | 'error';

function deleteOrphanBobble(id: string) {
  bobblesApi.deleteBobble(id).catch((error) => {
    logApiError('capture orphan cleanup failed', error);
  });
}

export default function ProcessingScreen() {
  const colors = useBobbleColors();
  const night = useNightForeground();
  const insets = useSafeAreaInsets();
  const [completedCount, setCompletedCount] = useState(0);
  const [phase, setPhase] = useState<ProcessPhase>('running');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  const recordingUri = useCaptureStore((state) => state.recordingUri);
  const recordingDurationSeconds = useCaptureStore((state) => state.recordingDurationSeconds);
  const clearRecording = useCaptureStore((state) => state.clearRecording);
  const textColor = night.text ?? colors.text;
  const secondaryColor = night.textSecondary ?? colors.textSecondary;

  const isComplete = phase === 'ready';

  const handleContinue = useCallback(() => {
    router.push('/capture/suggestions' as Href);
  }, []);

  const handleDiscard = useCallback(() => {
    const pending = useCaptureStore.getState().pendingBobbleSave;
    if (pending?.createdBobbleId) {
      deleteOrphanBobble(pending.createdBobbleId);
    }
    clearRecording();
    useCaptureStore.getState().clearPendingBobbleSave();
    router.replace('/(tabs)' as Href);
  }, [clearRecording]);

  useEffect(() => {
    let cancelled = false;
    let orphanBobbleId: string | null = null;
    let processingSucceeded = false;

    setPhase('running');
    setCompletedCount(0);
    setErrorMessage(null);

    (async () => {
      const durationSec = recordingDurationSeconds > 0 ? recordingDurationSeconds : 0;
      const durationMin = Math.max(1, Math.round(Math.max(durationSec, 60) / 60));
      const captureKind = useCaptureStore.getState().captureKind;
      const copy = CAPTURE_COPY[captureKind];
      const category = categoryFromCaptureKind(captureKind);
      const dateLabel = formatBobbleDateLabel(new Date().toISOString());

      try {
        // Step 1 — create bobble shell (skip AI until audio is attached)
        const bobble = await bobblesApi.createBobble({
          title: copy.title,
          category,
          durationSec: Math.max(0, Math.round(durationSec)),
          skipProcess: true,
        });

        orphanBobbleId = bobble._id;

        if (cancelled) {
          deleteOrphanBobble(bobble._id);
          return;
        }
        setCompletedCount(1);

        useCaptureStore.getState().setPendingBobbleSave({
          title: bobble.title || copy.title,
          dateLabel,
          durationMin,
          durationSec,
          category,
          tasks: [],
          createdBobbleId: bobble._id,
          suggestedTasks: [],
        });

        // Step 2 — prepare / upload audio (required for AssemblyAI transcription)
        if (!recordingUri) {
          throw new Error('Recording file was missing. Please record again.');
        }

        const audio = await readRecordingAsBase64(recordingUri);
        if (cancelled) return;
        setCompletedCount(2);

        if (!audio?.audioBase64) {
          throw new Error('Could not read your recording. Please try again.');
        }

        console.log('[capture] uploading audio for processing', {
          mimeType: audio.mimeType,
          bytesApprox: Math.round((audio.audioBase64.length * 3) / 4),
        });
        const processed = await bobblesApi.uploadBobbleAudio(bobble._id, {
          ...audio,
          process: true,
        });

        if (cancelled) return;
        setCompletedCount(3);

        const suggestedTasks = (processed.suggestedTasks ?? [])
          .map((title) => title.trim())
          .filter(Boolean);
        const successTitle = processed.title?.trim() || copy.title;

        useCaptureStore.getState().setPendingBobbleSave({
          title: successTitle,
          dateLabel,
          durationMin:
            processed.durationSec > 0
              ? Math.max(1, Math.round(processed.durationSec / 60))
              : durationMin,
          durationSec: processed.durationSec > 0 ? processed.durationSec : durationSec,
          category: processed.category ?? category,
          tasks: [],
          createdBobbleId: processed._id,
          suggestedTasks,
          summaryIntro: processed.summary?.intro,
          tasksGenerated: false,
        });

        setCompletedCount(4);
        setPhase('ready');
        processingSucceeded = true;
        orphanBobbleId = null;
      } catch (error) {
        const message = getApiErrorMessage(error, 'Could not process your recording');
        logApiError('capture process failed', error);
        if (!cancelled) {
          setErrorMessage(message);
          setPhase('error');
        }
      }
    })();

    return () => {
      cancelled = true;
      if (!processingSucceeded && orphanBobbleId) {
        deleteOrphanBobble(orphanBobbleId);
      }
    };
  }, [recordingUri, recordingDurationSeconds, retryToken]);

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <CaptureHeader leftLabel="Discard" onLeftPress={handleDiscard} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={[styles.title, { color: textColor }]}>
            {phase === 'error'
              ? 'Something went wrong'
              : isComplete
                ? 'Ready to review suggestions'
                : 'Bobble is listening...'}
          </Text>
          <Text style={[styles.subtitle, { color: secondaryColor }]}>
            {phase === 'error'
              ? errorMessage ?? 'Could not process your recording.'
              : isComplete
                ? 'I transcribed your recording and found key points. Continue to review task ideas.'
                : 'Sit tight while I transcribe and find the key points'}
          </Text>
        </View>

        <View style={styles.mascotWrap}>
          <Image source={PROCESSING_MASCOT} style={styles.mascot} contentFit="contain" />
        </View>

        {recordingUri ? (
          <View style={styles.playbackWrap}>
            <RecordingPlaybackBar uri={recordingUri} durationSeconds={recordingDurationSeconds} />
          </View>
        ) : null}

        {phase !== 'error' ? (
          <ProcessingChecklist
            steps={STEPS}
            completedCount={Math.min(completedCount, STEPS.length)}
          />
        ) : null}
      </ScrollView>

      {phase === 'error' ? (
        <View style={styles.actions}>
          <PrimaryButton
            label="Retry"
            style={styles.primaryAction}
            onPress={() => setRetryToken((n) => n + 1)}
          />
        </View>
      ) : isComplete ? (
        <View style={styles.actions}>
          <PrimaryButton
            label="Continue"
            style={styles.primaryAction}
            onPress={handleContinue}
          />
        </View>
      ) : (
        <Text style={[styles.footer, { color: secondaryColor }]}>
          Transcription can take up to a minute
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
  },
  hero: {
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    marginBottom: 8,
  },
  title: {
    ...Typography.heading,
    fontSize: 26,
    lineHeight: 34,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  mascotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascot: {
    width: 300,
    height: 224,
    backgroundColor: 'transparent',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
    gap: 16,
  },
  playbackWrap: {
    width: '100%',
  },
  actions: {
    marginTop: 'auto',
    paddingTop: 12,
  },
  primaryAction: {
    width: '100%',
  },
  footer: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
    textAlign: 'center',
    marginTop: 'auto',
    paddingTop: 12,
  },
});
