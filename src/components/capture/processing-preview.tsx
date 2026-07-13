import { Image } from 'expo-image';
import {
  Bell,
  Calendar,
  ChevronRight,
  CircleCheck,
  Dumbbell,
  FileText,
  Leaf,
  LucideIcon,
  ShoppingCart,
  Target,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Typography } from '@/src/theme/fonts';

const PROCESSING_TEXT = '#17164B';
const PREVIEW_MASCOT = require('@/src/assets/images/bobble-search.png');
const IDEAS_MASCOT = require('@/src/assets/images/bobble-heyStar.png');

type PreviewBullet = {
  label: string;
  value: string;
};

export type ProcessingPreviewPhase = 'found' | 'ideas' | 'tasks';

type ProcessingPreviewProps = {
  phase: ProcessingPreviewPhase;
  bullets: readonly PreviewBullet[];
  onSuggestionPress?: (id: string) => void;
};

type SuggestedTask = {
  id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
};

const BULLET_ICONS: Record<string, { Icon: LucideIcon; background: string; color: string }> = {
  Goal: { Icon: Target, background: '#FCE7F3', color: '#DB2777' },
  Workout: { Icon: Dumbbell, background: '#EDE9FE', color: '#7C3AED' },
  Nutrition: { Icon: Leaf, background: '#DCFCE7', color: '#16A34A' },
  Reminder: { Icon: Bell, background: '#FEF9C3', color: '#CA8A04' },
};

const DEFAULT_ICON = { Icon: Target, background: '#EDE9FE', color: '#7C3AED' };

const SUGGESTED_TASKS: readonly SuggestedTask[] = [
  {
    id: 'create-tasks',
    title: 'Create Tasks',
    description: 'Turn this into actionable tasks',
    Icon: CircleCheck,
  },
  {
    id: 'add-calendar',
    title: 'Add to Calendar',
    description: 'Schedule your workouts',
    Icon: Calendar,
  },
  {
    id: 'set-reminders',
    title: 'Set Reminders',
    description: 'Never miss your workouts',
    Icon: Bell,
  },
  {
    id: 'build-workout-plan',
    title: 'Build Workout Plan',
    description: 'Detailed plan for your goals',
    Icon: Dumbbell,
  },
  {
    id: 'create-shopping-list',
    title: 'Create Shopping List',
    description: 'For your nutrition plan',
    Icon: ShoppingCart,
  },
  {
    id: 'save-note',
    title: 'Save as Note',
    description: 'Keep this for later',
    Icon: FileText,
  },
];

function PreviewCard({ label, value }: PreviewBullet) {
  const { Icon, background, color } = BULLET_ICONS[label] ?? DEFAULT_ICON;

  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: background }]}>
        <Icon size={20} color={color} strokeWidth={2.2} />
      </View>
      <View style={styles.cardCopy}>
        <Text style={styles.cardTitle}>{label}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    </View>
  );
}

function SuggestionCard({
  title,
  description,
  Icon,
  onPress,
}: SuggestedTask & { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, styles.suggestionCard, pressed && styles.cardPressed]}
    >
      <View style={[styles.iconCircle, styles.suggestionIconCircle]}>
        <Icon size={20} color="#7C3AED" strokeWidth={2.2} />
      </View>
      <View style={styles.cardCopy}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{description}</Text>
      </View>
      <ChevronRight size={20} color="#9F52F2" strokeWidth={2.4} />
    </Pressable>
  );
}

export function ProcessingPreview({ phase, bullets, onSuggestionPress }: ProcessingPreviewProps) {
  const isIdeasPhase = phase === 'ideas';

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <Text style={styles.title}>{isIdeasPhase ? 'Bobble has ideas!' : "Here's what I found"}</Text>
        <Text style={styles.subtitle}>
          {isIdeasPhase ? 'How would you like me to help?' : 'A quick preview of your Bobble'}
        </Text>
      </View>

      <View style={styles.mascotWrap}>
        <Image
          source={isIdeasPhase ? IDEAS_MASCOT : PREVIEW_MASCOT}
          style={[styles.mascot]}
          contentFit="contain"
        />
      </View>

      <View style={[styles.cards]}>
        {isIdeasPhase
          ? SUGGESTED_TASKS.map((task) => (
              <SuggestionCard
                key={task.id}
                {...task}
                onPress={() => onSuggestionPress?.(task.id)}
              />
            ))
          : bullets.map((bullet) => (
              <PreviewCard key={bullet.label} label={bullet.label} value={bullet.value} />
            ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 12,
    paddingTop: 4,
  },
  hero: {
    alignItems: 'center',
    gap: 4,
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
    opacity: 0.82,
  },
  mascotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  mascot: {
    width: 380,
    height: 262,
    backgroundColor: 'transparent',
  },
  ideasMascot: {
    width: 300,
    height: 224,
  },
  cards: {
    gap: 10,
    marginTop: -85,
  },
  ideasCards: {
    marginTop: -12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  suggestionCard: {
    paddingRight: 14,
  },
  cardPressed: {
    opacity: 0.92,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionIconCircle: {
    backgroundColor: '#EDE9FE',
  },
  cardCopy: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    ...Typography.formLabel,
    fontSize: 16,
    lineHeight: 22,
    color: PROCESSING_TEXT,
  },
  cardValue: {
    ...Typography.caption,
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
});
