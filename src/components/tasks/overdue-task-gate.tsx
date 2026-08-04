import { ChevronRight } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { BobbleIcon } from '@/src/components/ui/bobble-icon';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { BobbleColors, FontFamily } from '@/src/theme';

type OverdueTaskGateProps = {
  visible: boolean;
  count: number;
  oldestDueAt?: string | null;
  onReview: () => void;
};

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function getDueContext(oldestDueAt?: string | null): string | null {
  if (!oldestDueAt) return null;
  const due = new Date(oldestDueAt);
  if (Number.isNaN(due.getTime())) return null;
  due.setHours(0, 0, 0, 0);

  const days = Math.max(
    1,
    Math.round((startOfToday().getTime() - due.getTime()) / (24 * 60 * 60 * 1000)),
  );
  return `Your oldest task was due ${days === 1 ? 'yesterday' : `${days} days ago`}.`;
}

export function OverdueTaskGate({
  visible,
  count,
  oldestDueAt,
  onReview,
}: OverdueTaskGateProps) {
  const colors = useBobbleColors();
  const dueContext = getDueContext(oldestDueAt);
  const noun = count === 1 ? 'task' : 'tasks';

  return (
    <Modal
      animationType="fade"
      onRequestClose={() => undefined}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.backdrop}>
        <View
          accessibilityRole="alert"
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={[styles.mascotBubble, { backgroundColor: `${colors.primary}18` }]}>
            <BobbleIcon size={62} />
            {/* <View style={styles.warningBadge}>
              <AlertTriangle color="#FFFFFF" size={16} strokeWidth={2.8} />
            </View> */}
          </View>

          {/* <Text style={[styles.eyebrow, { color: colors.error }]}>A quick Bobble check</Text> */}
          <Text style={[styles.title, { color: colors.text }]}>
            You have {count} overdue {noun}
          </Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {dueContext ? `${dueContext} ` : ''}Complete {count === 1 ? 'it' : 'them'} to continue
            with your next Bobble.
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={onReview}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonLabel}>View overdue {noun}</Text>
            <ChevronRight color="#FFFFFF" size={21} strokeWidth={2.6} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(28, 15, 52, 0.55)',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 22,
    alignItems: 'center',
    shadowColor: '#24103F',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  mascotBubble: {
    width: 88,
    height: 88,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  warningBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BobbleColors.error,
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  eyebrow: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    lineHeight: 19,
    marginBottom: 5,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    lineHeight: 31,
    textAlign: 'center',
  },
  message: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 9,
    marginBottom: 22,
  },
  button: {
    width: '100%',
    minHeight: 54,
    borderRadius: 27,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BobbleColors.primary,
  },
  buttonPressed: {
    opacity: 0.86,
    backgroundColor: BobbleColors.primaryDark,
  },
  buttonLabel: {
    fontFamily: FontFamily.bold,
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
});
