import { Bell, Dumbbell, Heart, Leaf, LucideIcon, Target } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { Typography } from '@/src/theme/fonts';

const SUMMARY_TEXT = '#17164B';

export type SummaryCardItem = {
  label: string;
  value: string;
};

type CardIconConfig = {
  Icon: LucideIcon;
  background: string;
  color: string;
};

const CARD_ICONS: Record<string, CardIconConfig> = {
  Goal: { Icon: Target, background: '#FCE7F3', color: '#DB2777' },
  'Workout Plan': { Icon: Dumbbell, background: '#EDE9FE', color: '#7C3AED' },
  Workout: { Icon: Dumbbell, background: '#EDE9FE', color: '#7C3AED' },
  Nutrition: { Icon: Leaf, background: '#DCFCE7', color: '#16A34A' },
  Reminder: { Icon: Bell, background: '#FEF9C3', color: '#CA8A04' },
};

const DEFAULT_ICON: CardIconConfig = {
  Icon: Target,
  background: '#EDE9FE',
  color: '#7C3AED',
};

function displayLabel(label: string) {
  return label === 'Workout' ? 'Workout Plan' : label;
}

function SummaryCard({ label, value }: SummaryCardItem) {
  const display = displayLabel(label);
  const { Icon, background, color } = CARD_ICONS[display] ?? CARD_ICONS[label] ?? DEFAULT_ICON;

  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: background }]}>
        <Icon size={20} color={color} strokeWidth={2.2} />
      </View>
      <Text style={styles.cardTitle}>{display}</Text>
      <Text style={styles.cardValue} numberOfLines={3}>
        {value}
      </Text>
    </View>
  );
}

type BobbleSummaryCardsProps = {
  items: readonly SummaryCardItem[];
  motivation?: string;
};

export function BobbleSummaryCards({
  items,
  motivation = "You're on the right track! Consistency is key.",
}: BobbleSummaryCardsProps) {
  const pairs: SummaryCardItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }

  return (
    <View style={styles.root}>
      <View style={styles.grid}>
        {pairs.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {row.map((item) => (
              <View key={item.label} style={styles.gridCell}>
                <SummaryCard {...item} />
              </View>
            ))}
            {row.length === 1 ? <View style={styles.gridCell} /> : null}
          </View>
        ))}
      </View>

      <View style={styles.motivation}>
        <Heart size={18} color="#9F52F2" fill="#9F52F2" strokeWidth={0} />
        <Text style={styles.motivationText}>{motivation}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 16,
  },
  grid: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCell: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 10,
    minHeight: 148,
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    ...Typography.formLabel,
    fontSize: 15,
    lineHeight: 20,
    color: SUMMARY_TEXT,
  },
  cardValue: {
    ...Typography.caption,
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
  },
  motivation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(159, 82, 242, 0.12)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  motivationText: {
    ...Typography.body,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#5B21B6',
  },
});
