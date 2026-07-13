import { Gauge, Heart, LineChart, LucideIcon, Smile, Star } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { InsightItem } from '@/src/data/demo-data';
import { DEMO_INSIGHTS } from '@/src/data/demo-data';
import { Typography } from '@/src/theme/fonts';

const INSIGHT_TEXT = '#17164B';

const ICONS: Record<InsightItem['icon'], LucideIcon> = {
  smile: Smile,
  chart: LineChart,
  star: Star,
  gauge: Gauge,
};

type InsightCardProps = {
  item: InsightItem;
};

function InsightIconCircle({ icon }: { icon: InsightItem['icon'] }) {
  const Icon = ICONS[icon];

  return (
    <View style={styles.iconCircle}>
      <Icon size={20} color="#9F52F2" strokeWidth={2.2} />
    </View>
  );
}

function InsightCard({ item }: InsightCardProps) {
  const isDetailed = Boolean(item.label);

  return (
    <View style={[styles.card, isDetailed && styles.cardDetailed]}>
      <InsightIconCircle icon={item.icon} />
      <View style={styles.cardCopy}>
        {isDetailed ? (
          <>
            <Text style={styles.cardLabel}>{item.label}</Text>
            <Text style={styles.cardValue}>{item.value}</Text>
            <Text style={styles.cardSubtext}>{item.subtext}</Text>
          </>
        ) : (
          <Text style={styles.cardText}>{item.text}</Text>
        )}
      </View>
    </View>
  );
}

type BobbleInsightsProps = {
  title?: string;
  items?: InsightItem[];
  reminder?: string;
};

export function BobbleInsights({
  title = DEMO_INSIGHTS.title,
  items = DEMO_INSIGHTS.items,
  reminder = DEMO_INSIGHTS.reminder,
}: BobbleInsightsProps) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{title}</Text>

      <View style={styles.list}>
        {items.map((item) => (
          <InsightCard key={item.id} item={item} />
        ))}
      </View>

      <View style={styles.reminder}>
        <Heart size={18} color="#9F52F2" fill="#9F52F2" strokeWidth={0} />
        <Text style={styles.reminderText}>{reminder}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 12,
  },
  title: {
    ...Typography.heading,
    fontSize: 24,
    lineHeight: 32,
    color: INSIGHT_TEXT,
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDetailed: {
    alignItems: 'flex-start',
    paddingVertical: 18,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(159, 82, 242, 0.14)',
  },
  cardCopy: {
    flex: 1,
    gap: 4,
  },
  cardText: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: INSIGHT_TEXT,
  },
  cardLabel: {
    ...Typography.formLabel,
    fontSize: 15,
    lineHeight: 20,
    color: INSIGHT_TEXT,
  },
  cardValue: {
    ...Typography.formLabel,
    fontSize: 16,
    lineHeight: 22,
    color: '#9F52F2',
  },
  cardSubtext: {
    ...Typography.caption,
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
    marginTop: 2,
  },
  reminder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(159, 82, 242, 0.14)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  reminderText: {
    ...Typography.body,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#5B21B6',
  },
});
