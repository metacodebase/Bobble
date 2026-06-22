import { Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
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
  if (tab === 'transcript') {
    return (
      <View style={styles.section}>
        <Text style={styles.body}>{DEMO_BOBBLE.transcript}</Text>
      </View>
    );
  }

  if (tab === 'mindmap') {
    return (
      <View style={styles.mindMap}>
        <View style={[styles.node, styles.nodePrimary]}>
          <Text style={styles.nodeTextPrimary}>Fitness plan</Text>
        </View>
        <View style={styles.branchRow}>
          <View style={styles.node}>
            <Text style={styles.nodeText}>Strength</Text>
          </View>
          <View style={styles.node}>
            <Text style={styles.nodeText}>Nutrition</Text>
          </View>
          <View style={styles.node}>
            <Text style={styles.nodeText}>Reminders</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.intro}>{DEMO_BOBBLE.intro}</Text>
      <View style={styles.list}>
        {DEMO_BOBBLE.bullets.map((item) => (
          <View key={item.label} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.bulletLabel}>{item.label}: </Text>
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.suggestionsTitle}>Suggestions</Text>
      {DEMO_BOBBLE.suggestions.map((suggestion) => (
        <View key={suggestion} style={styles.suggestionCard}>
          <Text style={styles.suggestionText}>{suggestion}</Text>
          <Pressable style={styles.suggestionAdd}>
            <Plus size={18} color={BobbleColors.textOnPrimary} strokeWidth={2.5} />
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
    color: BobbleColors.textSecondary,
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
    color: BobbleColors.primary,
    lineHeight: 24,
  },
  bulletText: {
    ...Typography.body,
    color: BobbleColors.text,
    flex: 1,
  },
  bulletLabel: {
    fontFamily: Typography.button.fontFamily,
  },
  suggestionsTitle: {
    ...Typography.formLabel,
    color: BobbleColors.text,
    marginTop: 8,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BobbleColors.borderLight,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  suggestionText: {
    ...Typography.body,
    color: BobbleColors.text,
    flex: 1,
    marginRight: 12,
  },
  suggestionAdd: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BobbleColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    ...Typography.body,
    color: BobbleColors.text,
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
    backgroundColor: BobbleColors.borderLight,
  },
  nodePrimary: {
    backgroundColor: BobbleColors.primary,
  },
  nodeText: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    color: BobbleColors.text,
  },
  nodeTextPrimary: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    color: BobbleColors.textOnPrimary,
  },
});
