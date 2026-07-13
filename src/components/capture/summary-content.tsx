import { Check } from 'lucide-react-native';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { GeneratedTask, GeneratedTaskRow } from '@/src/components/capture/generated-task-row';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { Typography } from '@/src/theme/fonts';

export const DEMO_BOBBLE = {
  title: 'Gym routine & nutrition plan',
  intro: "Here's what I captured for you.",
  mindScore: 41,
  mindMapCenter: 'Fitness plan',
  mindMapBranches: ['Strength', 'Nutrition', 'Reminders'],
  bullets: [
    { label: 'Goal', value: 'Build muscle & improve stamina' },
    { label: 'Workout Plan', value: '5 days a week Focus on strength' },
    { label: 'Nutrition', value: 'High protein, balanced meals' },
    { label: 'Reminder', value: 'Add workout reminders' },
  ],
  transcript:
    "I want to build muscle and improve my stamina. I'm planning to work out five days a week with a focus on strength training. For nutrition, I'll stick to high protein and balanced meals. Also, please add reminders for my workouts.",
  suggestions: [
    {
      title: 'Create a weekly workout plan',
      description: 'Bobble generates editable tasks — not just a suggestion.',
      actionLabel: 'Generate tasks',
    },
  ],
} as const;

type MindScoreCardProps = {
  score?: number;
};

export function MindScoreCard({ score = DEMO_BOBBLE.mindScore }: MindScoreCardProps) {
  const colors = useBobbleColors();
  const scoreTone =
    score >= 70 ? 'Well organized' : score >= 40 ? 'Getting clearer' : 'Still scattered';

  return (
    <View style={[mindScoreStyles.card, { backgroundColor: colors.borderLight }]}>
      <Text style={[mindScoreStyles.label, { color: colors.textSecondary }]}>Mind Score</Text>
      <View style={mindScoreStyles.row}>
        <Text style={[mindScoreStyles.value, { color: colors.primary }]}>{score}</Text>
        <Text style={[mindScoreStyles.max, { color: colors.textSecondary }]}>/100</Text>
      </View>
      <View style={[mindScoreStyles.track, { backgroundColor: colors.border }]}>
        <View
          style={[mindScoreStyles.fill, { width: `${score}%`, backgroundColor: colors.primary }]}
        />
      </View>
      <Text style={[mindScoreStyles.hint, { color: colors.textSecondary }]}>
        {scoreTone}. Bobble scores how clearly your thoughts connect — higher means more structure
        and fewer loose ends.
      </Text>
    </View>
  );
}

type SummaryContentProps = {
  tab: 'summary' | 'transcript' | 'mindmap' | 'insights';
  tasks?: GeneratedTask[];
  isGeneratingTasks?: boolean;
  onGenerateTasks?: () => void;
  onUpdateTask?: (id: string, title: string) => void;
  onDeleteTask?: (id: string) => void;
};

export function SummaryContent({
  tab,
  tasks = [],
  isGeneratingTasks = false,
  onGenerateTasks,
  onUpdateTask,
  onDeleteTask,
}: SummaryContentProps) {
  const colors = useBobbleColors();
  const night = useNightForeground();

  if (tab === 'transcript') {
    return null;
  }

  if (tab === 'insights') {
    return null;
  }

  if (tab === 'mindmap') {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={[styles.intro, { color: night.textSecondary ?? colors.textSecondary }]}>
        {DEMO_BOBBLE.intro}
      </Text>
      <View style={styles.list}>
        {DEMO_BOBBLE.bullets.map((item) => (
          <View key={item.label} style={styles.bulletRow}>
            <Text style={[styles.bulletDot, { color: colors.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: night.text ?? colors.text }]}>
              <Text style={styles.bulletLabel}>{item.label}: </Text>
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.suggestionsTitle, { color: night.text ?? colors.text }]}>Suggestions</Text>
      <Text style={[styles.suggestionsHint, { color: night.textSecondary ?? colors.textSecondary }]}>
        Tap generate to create tasks you can edit — Bobble does the work for you.
      </Text>
      {DEMO_BOBBLE.suggestions.map((suggestion) => {
        const isDone = tasks.length > 0;
        const canGenerate = !isDone && !isGeneratingTasks;

        return (
          <View
            key={suggestion.title}
            style={[styles.suggestionCard, { backgroundColor: colors.borderLight }]}
          >
            <View style={styles.suggestionCopy}>
              <Text style={[styles.suggestionText, { color: night.text ?? colors.text }]}>
                {suggestion.title}
              </Text>
              <Text style={[styles.suggestionDescription, { color: night.textSecondary ?? colors.textSecondary }]}>
                {suggestion.description}
              </Text>
            </View>
            {isDone ? (
              <View style={[styles.suggestionDone, { backgroundColor: colors.primary }]}>
                <Check size={16} color={colors.textOnPrimary} strokeWidth={2.5} />
              </View>
            ) : (
              <Pressable
                onPress={canGenerate ? onGenerateTasks : undefined}
                disabled={!canGenerate}
                style={[
                  styles.suggestionAction,
                  { backgroundColor: colors.primary },
                  !canGenerate && styles.suggestionActionDisabled,
                ]}
              >
                {isGeneratingTasks ? (
                  <ActivityIndicator size="small" color={colors.textOnPrimary} />
                ) : (
                  <Text style={[styles.suggestionActionLabel, { color: colors.textOnPrimary }]}>
                    {suggestion.actionLabel}
                  </Text>
                )}
              </Pressable>
            )}
          </View>
        );
      })}

      {tasks.length > 0 || isGeneratingTasks ? (
        <View style={styles.tasksSection}>
          <Text style={[styles.tasksTitle, { color: night.text ?? colors.text }]}>Tasks</Text>
          <View style={styles.tasksList}>
            {tasks.map((task) => (
              <GeneratedTaskRow
                key={task.id}
                task={task}
                onUpdate={onUpdateTask ?? (() => {})}
                onDelete={onDeleteTask ?? (() => {})}
              />
            ))}
            {isGeneratingTasks ? (
              <View style={styles.generatingRow}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.generatingText, { color: night.textSecondary ?? colors.textSecondary }]}>
                  Adding tasks...
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '95%',
    alignSelf: 'center',
    gap: 16,
  },
  intro: {
    ...Typography.body,
  },
  list: {
    gap: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bulletDot: {
    ...Typography.body,
    lineHeight: 24,
  },
  bulletText: {
    ...Typography.body,
    flex: 1,
  },
  bulletLabel: {
    fontFamily: Typography.button.fontFamily,
  },
  suggestionsTitle: {
    ...Typography.formLabel,
    marginTop: 8,
  },
  suggestionsHint: {
    ...Typography.caption,
    marginTop: -8,
  },
  suggestionCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  suggestionCopy: {
    flex: 1,
    gap: 4,
  },
  suggestionText: {
    ...Typography.body,
  },
  suggestionDescription: {
    ...Typography.caption,
  },
  suggestionAction: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 108,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionActionDisabled: {
    opacity: 0.45,
  },
  suggestionActionLabel: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
  },
  suggestionDone: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tasksSection: {
    gap: 12,
    marginTop: 4,
  },
  tasksTitle: {
    ...Typography.formLabel,
  },
  tasksList: {
    gap: 10,
  },
  generatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  generatingText: {
    ...Typography.caption,
  },
  body: {
    ...Typography.body,
  },
  mindMapSection: {
    width: '95%',
    alignSelf: 'center',
    gap: 16,
  },
  mindMapTitle: {
    ...Typography.formLabel,
  },
  mindMapIntro: {
    ...Typography.caption,
    marginTop: -8,
  },
  mindMap: {
    alignItems: 'center',
    gap: 20,
    paddingVertical: 12,
  },
  branchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  node: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  nodeText: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
  },
  nodeTextPrimary: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
  },
});

const mindScoreStyles = StyleSheet.create({
  card: {
    width: '95%',
    alignSelf: 'center',
    borderRadius: 20,
    padding: 20,
    gap: 10,
    marginBottom: 4,
  },
  label: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  value: {
    ...Typography.heading,
    fontSize: 40,
    lineHeight: 44,
  },
  max: {
    ...Typography.body,
    marginBottom: 6,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  hint: {
    ...Typography.caption,
  },
});
