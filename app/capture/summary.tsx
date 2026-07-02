import { Href, router } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaptureHeader } from '@/src/components/capture/capture-header';
import {
  buildTasksFromCapture,
  TASK_STAGGER_MS,
} from '@/src/components/capture/generate-capture-tasks';
import { GeneratedTask } from '@/src/components/capture/generated-task-row';
import { SegmentTabs, SummaryTab } from '@/src/components/capture/segment-tabs';
import { DEMO_BOBBLE, SummaryContent } from '@/src/components/capture/summary-content';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useCreateTasksBulk } from '@/src/hooks/tasks';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';

export default function SummaryScreen() {
  const colors = useBobbleColors();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<SummaryTab>('summary');
  const [tasks, setTasks] = useState<GeneratedTask[]>([]);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const generationTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const createTasksBulk = useCreateTasksBulk();

  const handleSaveBobble = useCallback(() => {
    const navigateToSaved = () => router.push('/capture/saved' as Href);

    if (tasks.length === 0) {
      navigateToSaved();
      return;
    }

    createTasksBulk.mutate(
      { tasks: tasks.map((task) => ({ title: task.title })) },
      { onSettled: navigateToSaved },
    );
  }, [createTasksBulk, tasks]);

  const clearGenerationTimeouts = useCallback(() => {
    generationTimeoutsRef.current.forEach(clearTimeout);
    generationTimeoutsRef.current = [];
  }, []);

  useEffect(() => () => clearGenerationTimeouts(), [clearGenerationTimeouts]);

  const handleGenerateTasks = useCallback(() => {
    if (isGeneratingTasks || tasks.length > 0) return;

    const templates = buildTasksFromCapture(DEMO_BOBBLE.bullets);
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
    <View style={[styles.root, { paddingTop: insets.top + 8, backgroundColor: colors.background }]}>
      <View style={styles.headerBlock}>
        <CaptureHeader
          title={DEMO_BOBBLE.title}
          onBack={() => router.back()}
          rightIcon={Pencil}
        />
        <SegmentTabs active={tab} onChange={setTab} />
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

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background,width:"100%" }]}>
        <PrimaryButton
          label="Save Bobble"
          style={{ width: '100%' }}
          loading={createTasksBulk.isPending}
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
