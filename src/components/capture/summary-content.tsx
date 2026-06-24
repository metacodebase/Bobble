import { Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export const DEMO_BOBBLE = {
  title: 'Gym routine & nutrition plan',
  intro: "Here's what I captured for you.",
  bullets: [
    { label: 'Goal', value: 'Build muscle & improve stamina' },
    { label: 'Workout', value: '5 days a week (Focus on strength)' },
    { label: 'Nutrition', value: 'High protein, balanced meals' },
    { label: 'Reminder', value: 'Add reminders for workouts' },
  ],
  transcript:
    "I want to build muscle and improve my stamina. I'm planning to work out five days a week with a focus on strength training. For nutrition, I'll stick to high protein and balanced meals. Also, please add reminders for my workouts.",
  suggestions: ['Create a weekly workout plan'],
} as const;

type SummaryContentProps = {
  tab: 'summary' | 'transcript' | 'mindmap';
};

export function SummaryContent({ tab }: SummaryContentProps) {
  const colors = useBobbleColors();

  if (tab === 'transcript') {
    return (
      <View style={styles.section}>
        <Text style={[styles.body, { color: colors.text }]}>{DEMO_BOBBLE.transcript}</Text>
      </View>
    );
  }

  if (tab === 'mindmap') {
    return (
      <View style={styles.mindMap}>
        <View style={[styles.node, { backgroundColor: colors.primary }]}>
          <Text style={[styles.nodeTextPrimary, { color: colors.textOnPrimary }]}>Fitness plan</Text>
        </View>
        <View style={styles.branchRow}>
          {['Strength', 'Nutrition', 'Reminders'].map((label) => (
            <View key={label} style={[styles.node, { backgroundColor: colors.borderLight }]}>
              <Text style={[styles.nodeText, { color: colors.text }]}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={[styles.intro, { color: colors.textSecondary }]}>{DEMO_BOBBLE.intro}</Text>
      <View style={styles.list}>
        {DEMO_BOBBLE.bullets.map((item) => (
          <View key={item.label} style={styles.bulletRow}>
            <Text style={[styles.bulletDot, { color: colors.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: colors.text }]}>
              <Text style={styles.bulletLabel}>{item.label}: </Text>
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.suggestionsTitle, { color: colors.text }]}>Suggestions</Text>
      {DEMO_BOBBLE.suggestions.map((suggestion) => (
        <View
          key={suggestion}
          style={[styles.suggestionCard, { backgroundColor: colors.borderLight }]}
        >
          <Text style={[styles.suggestionText, { color: colors.text }]}>{suggestion}</Text>
          <Pressable style={[styles.suggestionAdd, { backgroundColor: colors.primary }]}>
            <Plus size={18} color={colors.textOnPrimary} strokeWidth={2.5} />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
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
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  suggestionText: {
    ...Typography.body,
    flex: 1,
    marginRight: 12,
  },
  suggestionAdd: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    ...Typography.body,
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
