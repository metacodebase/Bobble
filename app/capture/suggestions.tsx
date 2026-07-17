import { Image } from 'expo-image';
import { Href, router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bobblesApi, tasksApi } from '@/src/api';
import { CaptureHeader } from '@/src/components/capture/capture-header';
import { GeneratedTaskRow } from '@/src/components/capture/generated-task-row';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { useCaptureStore } from '@/src/store/capture-store';
import { getApiErrorMessage, logApiError } from '@/src/utils/api-error';
import { toast } from '@/src/utils/toast';
import { Typography } from '@/src/theme/fonts';

const TASKS_MASCOT = require('@/src/assets/images/bobble-tasks-ready.png');

type SuggestionTask = {
  id: string;
  title: string;
  selected: boolean;
  /** Set after tasks are persisted via the API. */
  persistedId?: string;
};

export default function SuggestionsScreen() {
  const colors = useBobbleColors();
  const night = useNightForeground();
  const insets = useSafeAreaInsets();
  const pendingSave = useCaptureStore((state) => state.pendingBobbleSave);
  const clearRecording = useCaptureStore((state) => state.clearRecording);
  const textColor = night.text ?? colors.text;
  const secondaryColor = night.textSecondary ?? colors.textSecondary;

  const [tasks, setTasks] = useState<SuggestionTask[]>(() => {
    const pending = useCaptureStore.getState().pendingBobbleSave;
    if (pending?.tasksGenerated && pending.tasks.length > 0) {
      return pending.tasks.map((task, index) => ({
        id: task.id ?? `generated-${index}`,
        persistedId: task.id,
        title: task.title,
        selected: true,
      }));
    }

    const titles = pending?.suggestedTasks ?? [];
    return titles.map((title, index) => ({
      id: `suggestion-${index}`,
      title,
      selected: true,
    }));
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [tasksGenerated, setTasksGenerated] = useState(
    () => Boolean(useCaptureStore.getState().pendingBobbleSave?.tasksGenerated),
  );

  const selectedCount = tasks.filter((task) => task.selected).length;
  const hasSuggestions = tasks.length > 0;
  const title = pendingSave?.title ?? 'Your Bobble';
  const summaryIntro = pendingSave?.summaryIntro;

  const syncTasksToStore = useCallback((nextTasks: SuggestionTask[]) => {
    const current = useCaptureStore.getState().pendingBobbleSave;
    if (!current) return;

    useCaptureStore.getState().setPendingBobbleSave({
      ...current,
      tasks: nextTasks
        .filter((task) => task.persistedId)
        .map((task) => ({ id: task.persistedId, title: task.title.trim() })),
    });
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, selected: !task.selected } : task)),
    );
  }, []);

  const handleUpdateTask = useCallback(
    async (id: string, title: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;

      const task = tasks.find((entry) => entry.id === id);
      if (!task?.persistedId) return;

      const previous = tasks;
      const next = previous.map((entry) =>
        entry.id === id ? { ...entry, title: trimmed } : entry,
      );
      setTasks(next);

      try {
        await tasksApi.updateTask(task.persistedId, { title: trimmed });
        syncTasksToStore(next);
      } catch (error) {
        setTasks(previous);
        const message = getApiErrorMessage(error, 'Could not update task');
        logApiError('capture update task failed', error);
        toast.error(message, 'Update failed');
      }
    },
    [syncTasksToStore, tasks],
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      const task = tasks.find((entry) => entry.id === id);
      if (!task?.persistedId) return;

      const previous = tasks;
      const next = previous.filter((entry) => entry.id !== id);
      setTasks(next);

      try {
        await tasksApi.deleteTask(task.persistedId);
        syncTasksToStore(next);
      } catch (error) {
        setTasks(previous);
        const message = getApiErrorMessage(error, 'Could not delete task');
        logApiError('capture delete task failed', error);
        toast.error(message, 'Delete failed');
      }
    },
    [syncTasksToStore, tasks],
  );

  const handleDiscard = useCallback(() => {
    const pending = useCaptureStore.getState().pendingBobbleSave;
    if (pending?.createdBobbleId) {
      bobblesApi.deleteBobble(pending.createdBobbleId).catch((error) => {
        logApiError('capture discard cleanup failed', error);
      });
    }
    clearRecording();
    useCaptureStore.getState().clearPendingBobbleSave();
    router.replace('/(tabs)' as Href);
  }, [clearRecording]);

  const handleGenerateTasks = useCallback(async () => {
    const bobbleId = pendingSave?.createdBobbleId;
    if (!bobbleId || isGenerating || tasksGenerated) return;

    const selected = tasks.filter((task) => task.selected && task.title.trim());
    if (selected.length === 0) {
      toast.error('Select at least one suggestion', 'No tasks selected');
      return;
    }

    setIsGenerating(true);
    try {
      const created = await tasksApi.createTasksBulk({
        bobble: bobbleId,
        tasks: selected.map((task) => ({ title: task.title.trim() })),
      });

      const generatedTasks: SuggestionTask[] = created.map((task) => ({
        id: task._id,
        persistedId: task._id,
        title: task.title,
        selected: true,
      }));

      const current = useCaptureStore.getState().pendingBobbleSave;
      if (current) {
        useCaptureStore.getState().setPendingBobbleSave({
          ...current,
          tasks: generatedTasks.map((task) => ({ id: task.persistedId, title: task.title })),
          tasksGenerated: true,
        });
      }

      setTasks(generatedTasks);
      setTasksGenerated(true);
      toast.success(
        selected.length === 1 ? '1 task created' : `${selected.length} tasks created`,
        'Tasks ready',
      );
    } catch (error) {
      const message = getApiErrorMessage(error, 'Could not create tasks');
      logApiError('capture generate tasks failed', error);
      toast.error(message, 'Generate failed');
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, pendingSave?.createdBobbleId, tasks, tasksGenerated]);

  const handleSaveBobble = useCallback(() => {
    if (!pendingSave?.createdBobbleId) {
      toast.error('Bobble was not created yet', 'Save failed');
      router.replace('/capture/processing' as Href);
      return;
    }
    router.replace('/capture/saving' as Href);
  }, [pendingSave?.createdBobbleId]);

  // No bobble processed yet — send user back
  if (!pendingSave?.createdBobbleId) {
    return (
      <View
        style={[
          styles.root,
          {
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 24,
            justifyContent: 'center',
            gap: 16,
          },
        ]}
      >
        <Text style={[styles.title, { color: textColor }]}>Nothing to review yet</Text>
        <Text style={[styles.subtitle, { color: secondaryColor }]}>
          Process a recording first, then come back for task suggestions.
        </Text>
        <PrimaryButton label="Back" onPress={() => router.replace('/(tabs)' as Href)} />
      </View>
    );
  }

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
            {tasksGenerated
              ? 'Review your tasks'
              : hasSuggestions
                ? 'Suggestions from your Bobble'
                : 'Ready to save'}
          </Text>
          <Text style={[styles.subtitle, { color: secondaryColor }]}>
            {tasksGenerated
              ? 'Review and edit your tasks, then save the bobble to finish.'
              : hasSuggestions
                ? 'Pick which ones to turn into tasks, or skip and save the bobble.'
                : 'No task suggestions this time — you can still save your bobble.'}
          </Text>
        </View>

        <View style={styles.mascotWrap}>
          <Image source={TASKS_MASCOT} style={styles.mascot} contentFit="contain" />
        </View>

        <View style={[styles.summaryCard, { backgroundColor: `${colors.primary}14` }]}>
          <Text style={[styles.summaryTitle, { color: textColor }]} numberOfLines={2}>
            {title}
          </Text>
          {summaryIntro ? (
            <Text style={[styles.summaryIntro, { color: secondaryColor }]} numberOfLines={4}>
              {summaryIntro}
            </Text>
          ) : null}
        </View>

        {hasSuggestions ? (
          <View style={styles.taskList}>
            {tasksGenerated
              ? tasks.map((task) => (
                  <GeneratedTaskRow
                    key={task.id}
                    task={{ id: task.id, title: task.title }}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                  />
                ))
              : tasks.map((task) => {
                  const checked = task.selected;
                  return (
                    <Pressable
                      key={task.id}
                      onPress={() => toggleTask(task.id)}
                      style={({ pressed }) => [
                        styles.taskRow,
                        { backgroundColor: colors.borderLight },
                        pressed && styles.pressed,
                      ]}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: colors.primary,
                            backgroundColor: checked ? colors.primary : 'transparent',
                          },
                        ]}
                      >
                        {checked ? (
                          <Check size={14} color={colors.textOnPrimary} strokeWidth={3} />
                        ) : null}
                      </View>
                      <Text style={[styles.taskTitle, { color: textColor }]} numberOfLines={3}>
                        {task.title}
                      </Text>
                    </Pressable>
                  );
                })}
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.actions}>
        {!tasksGenerated && hasSuggestions ? (
          <PrimaryButton
            label={
              selectedCount > 0
                ? `Generate ${selectedCount} Task${selectedCount === 1 ? '' : 's'}`
                : 'Generate Tasks'
            }
            style={styles.primaryAction}
            loading={isGenerating}
            disabled={isGenerating || selectedCount === 0}
            onPress={handleGenerateTasks}
          />
        ) : null}

        {tasksGenerated || !hasSuggestions ? (
          <PrimaryButton
            label="Save Bobble"
            style={styles.primaryAction}
            onPress={handleSaveBobble}
          />
        ) : (
          <Pressable
            onPress={handleSaveBobble}
            disabled={isGenerating}
            style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}
          >
            <Text style={[styles.skipLabel, { color: colors.primary }]}>Skip & Save Bobble</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
    gap: 12,
  },
  hero: {
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
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
    width: 280,
    height: 180,
    backgroundColor: 'transparent',
  },
  summaryCard: {
    borderRadius: 18,
    padding: 16,
    gap: 6,
    marginTop: -40,
  },
  summaryTitle: {
    ...Typography.formLabel,
    fontSize: 18,
    lineHeight: 24,
  },
  summaryIntro: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  taskList: {
    gap: 10,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTitle: {
    ...Typography.body,
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },
  actions: {
    gap: 8,
    paddingTop: 12,
  },
  primaryAction: {
    width: '100%',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipLabel: {
    ...Typography.formLabel,
    fontSize: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});
