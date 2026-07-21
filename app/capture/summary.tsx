import { Href, router } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaptureHeader } from '@/src/components/capture/capture-header';
import {
  buildWeeklyWorkoutPlanTasks,
  TASK_STAGGER_MS,
} from '@/src/components/capture/generate-capture-tasks';
import { GeneratedTask } from '@/src/components/capture/generated-task-row';
import { SegmentTabs, SummaryTab } from '@/src/components/capture/segment-tabs';
import { DEMO_BOBBLE, SummaryContent } from '@/src/components/capture/summary-content';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { formatBobbleDateLabel } from '@/src/features/bobbles/format';
import { categoryFromCaptureKind } from '@/src/features/bobbles/types';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { CAPTURE_COPY, useCaptureStore } from '@/src/store/capture-store';
import { Typography } from '@/src/theme/fonts';

export default function SummaryScreen() {
  const colors = useBobbleColors();
  const night = useNightForeground();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<SummaryTab>('summary');
  const [tasks, setTasks] = useState<GeneratedTask[]>([]);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const generationTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const recordingDurationSeconds = useCaptureStore((s) => s.recordingDurationSeconds);

  const handleSaveBobble = useCallback(() => {
    const durationSec = recordingDurationSeconds > 0 ? recordingDurationSeconds : 60;
    const durationMin = Math.max(1, Math.round(durationSec / 60));
    const captureKind = useCaptureStore.getState().captureKind;
    const copy = CAPTURE_COPY[captureKind];

    useCaptureStore.getState().setPendingBobbleSave({
      title: copy.title,
      dateLabel: formatBobbleDateLabel(new Date().toISOString()),
      durationMin,
      durationSec,
      category: categoryFromCaptureKind(captureKind),
      tasks: [],
    });

    router.push('/capture/saving' as Href);
  }, [recordingDurationSeconds]);

  const clearGenerationTimeouts = useCallback(() => {
    generationTimeoutsRef.current.forEach(clearTimeout);
    generationTimeoutsRef.current = [];
  }, []);

  useEffect(() => () => clearGenerationTimeouts(), [clearGenerationTimeouts]);

  const handleGenerateTasks = useCallback(() => {
    if (isGeneratingTasks || tasks.length > 0) return;

    const templates = buildWeeklyWorkoutPlanTasks();
    const batchId = Date.now();
    setIsGeneratingTasks(true);

    templates.forEach((template, index) => {
      const timeout = setTimeout(() => {
        setTasks((prev) => [...prev, { ...template, id: `${batchId}-${index}` }]);

        if (index === templates.length - 1) {
          setIsGeneratingTasks(false);
        }
      }, index * TASK_STAGGER_MS);

      generationTimeoutsRef.current.push(timeout);
    });
  }, [isGeneratingTasks, tasks.length]);

  const handleUpdateTask = useCallback((id: string, title: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, title } : task)));
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.headerBlock}>
        <CaptureHeader onBack={() => router.back()} rightIcon={Pencil} />
        <SegmentTabs active={tab} onChange={setTab} />
        <Text style={[styles.title, { color: night.text ?? colors.text }]} numberOfLines={2}>
          {DEMO_BOBBLE.title}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <SummaryContent
          tab={tab}
          tasks={tasks}
          isGeneratingTasks={isGeneratingTasks}
          onGenerateTasks={handleGenerateTasks}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton
          label="Save Bobble"
          style={styles.saveAction}
          loading={false}
          onPress={handleSaveBobble}
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
    width: '95%',
    alignSelf: 'center',
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
  saveAction: {
    width: '95%',
    alignSelf: 'center',
  },
});
