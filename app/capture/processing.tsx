import { Image } from 'expo-image';
import { Href, router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaptureHeader } from '@/src/components/capture/capture-header';
import { buildWeeklyWorkoutPlanTasks } from '@/src/components/capture/generate-capture-tasks';
import { ProcessingChecklist } from '@/src/components/capture/processing-checklist';
import {
  ProcessingPreview,
  ProcessingPreviewPhase,
} from '@/src/components/capture/processing-preview';
import { ProcessingTasksReview, ReviewTask } from '@/src/components/capture/processing-tasks-review';
import { RecordingPlaybackBar } from '@/src/components/capture/recording-playback-bar';
import { DEMO_BOBBLE } from '@/src/components/capture/summary-content';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useCreateTasksBulk } from '@/src/hooks/tasks';
import { useCaptureStore } from '@/src/store/capture-store';
import { Typography } from '@/src/theme/fonts';

const PROCESSING_TEXT = '#17164B';
const PROCESSING_MASCOT = require('@/src/assets/images/bobble-dualSound.png');

const PROCESSING_AUTO_ADVANCE = true;

const STEPS = [
  { id: 'listen', label: 'Listening to your Bobble...', icon: 'ear' },
  { id: 'points', label: 'Finding the key points...', icon: 'list' },
  { id: 'connect', label: 'Connecting your ideas...', icon: 'lightbulb' },
  { id: 'ready', label: 'Almost ready!', icon: 'bobble' },
] as const;

export default function ProcessingScreen() {
  const insets = useSafeAreaInsets();
  const [completedCount, setCompletedCount] = useState(0);
  const [previewPhase, setPreviewPhase] = useState<ProcessingPreviewPhase>('found');
  const [tasks, setTasks] = useState<ReviewTask[]>([]);
  const isComplete = completedCount >= STEPS.length;
  const showIdeas = isComplete && previewPhase === 'ideas';
  const showTasks = isComplete && previewPhase === 'tasks';
  const recordingUri = useCaptureStore((state) => state.recordingUri);
  const recordingDurationSeconds = useCaptureStore((state) => state.recordingDurationSeconds);
  const clearRecording = useCaptureStore((state) => state.clearRecording);
  const createTasksBulk = useCreateTasksBulk();

  const handleGenerateTasks = useCallback(() => {
    const batchId = Date.now();
    setTasks(
      buildWeeklyWorkoutPlanTasks().map((template, index) => ({
        ...template,
        id: `${batchId}-${index}`,
      })),
    );
    setPreviewPhase('tasks');
  }, []);

  const handleUpdateTask = useCallback((id: string, title: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, title } : task)));
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const handleSaveBobble = useCallback(() => {
    const navigateToBobble = () =>
      router.replace({ pathname: '/bobble/[id]', params: { id: '1' } } as Href);

    if (tasks.length === 0) {
      navigateToBobble();
      return;
    }

    createTasksBulk.mutate(
      { tasks: tasks.map((task) => ({ title: task.title })) },
      { onSettled: navigateToBobble },
    );
  }, [createTasksBulk, tasks]);

  useEffect(() => {
    if (!PROCESSING_AUTO_ADVANCE || isComplete) return;

    const timeout = setTimeout(() => {
      setCompletedCount((prev) => prev + 1);
    }, 900);

    return () => clearTimeout(timeout);
  }, [completedCount, isComplete]);

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
      <CaptureHeader
        leftLabel="Discard"
        onLeftPress={() => {
          clearRecording();
          router.replace('/(tabs)' as Href);
        }}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!isComplete ? (
          <>
            <View style={styles.hero}>
              <Text style={styles.title}>Bobble is listening...</Text>
              <Text style={styles.subtitle}>Sit tight while I work my magic</Text>
            </View>

            <View style={styles.mascotWrap}>
              <Image source={PROCESSING_MASCOT} style={styles.mascot} contentFit="contain" />
            </View>

            {recordingUri ? (
              <View style={styles.playbackWrap}>
                <RecordingPlaybackBar uri={recordingUri} durationSeconds={recordingDurationSeconds} />
              </View>
            ) : null}

            <ProcessingChecklist steps={STEPS} completedCount={completedCount} />
          </>
        ) : showTasks ? (
          <ProcessingTasksReview
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <ProcessingPreview phase={previewPhase} bullets={DEMO_BOBBLE.bullets} />
        )}
      </ScrollView>

      {isComplete ? (
        <View style={styles.actions}>
          <PrimaryButton
            label={showTasks ? 'Save Bobble' : showIdeas ? 'Generate Tasks' : 'Continue'}
            style={styles.primaryAction}
            loading={showTasks ? createTasksBulk.isPending : false}
            onPress={() => {
              if (showTasks) {
                handleSaveBobble();
                return;
              }

              if (showIdeas) {
                handleGenerateTasks();
                return;
              }

              setPreviewPhase('ideas');
            }}
          />
        </View>
      ) : (
        <Text style={styles.footer}>This usually takes 10–20 seconds</Text>
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
    color: PROCESSING_TEXT,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    fontSize: 16,
    lineHeight: 24,
    color: PROCESSING_TEXT,
    textAlign: 'center',
    opacity: 0.85,
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
    color: PROCESSING_TEXT,
    textAlign: 'center',
    marginTop: 'auto',
    paddingTop: 12,
  },
});
