import { Image } from 'expo-image';
import { Check, Ear, Lightbulb, List } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const PROCESSING_TEXT = '#17164B';
const CHECK_GREEN = '#22C55E';
const CHECK_GREEN_LIGHT = '#DCFCE7';
const BOBBLE_ICON = require('@/src/assets/images/bobble-tab-active.png');

export type ProcessingStep = {
  id: string;
  label: string;
  icon: 'ear' | 'list' | 'lightbulb' | 'bobble';
};

type ProcessingChecklistProps = {
  steps: readonly ProcessingStep[];
  completedCount: number;
  revealedCount: number;
};

const ICON_BOX = 36;
const CHECK_BOX = 26;

function StepIcon({ type }: { type: ProcessingStep['icon'] }) {
  const colors = useBobbleColors();

  return (
    <View style={[styles.iconBox, { backgroundColor: `${colors.primary}18` }]}>
      {type === 'ear' ? (
        <Ear size={18} color={colors.primaryLight} strokeWidth={2.2} />
      ) : type === 'list' ? (
        <List size={18} color={colors.primaryLight} strokeWidth={2.2} />
      ) : type === 'lightbulb' ? (
        <Lightbulb size={18} color={colors.primaryLight} strokeWidth={2.2} />
      ) : (
        <Image source={BOBBLE_ICON} style={styles.bobbleIcon} contentFit="contain" />
      )}
    </View>
  );
}

function CompletedCheck() {
  return (
    <View style={styles.checkCircle}>
      <Check size={13} color={CHECK_GREEN} strokeWidth={3} />
    </View>
  );
}

export function ProcessingChecklist({
  steps,
  completedCount,
  revealedCount,
}: ProcessingChecklistProps) {
  const colors = useBobbleColors();

  return (
    <View style={[styles.container, { backgroundColor: `${colors.primary}14` }]}>
      {steps.map((step, index) => {
        const done = index < revealedCount;
        const pending = index > completedCount;
        const active = !done && !pending;

        return (
          <View key={step.id} style={[styles.card, pending && styles.cardPending]}>
            <StepIcon type={step.icon} />
            <Text
              style={[
                styles.label,
                { color: PROCESSING_TEXT },
                pending && styles.labelPending,
                active && styles.labelActive,
                done && styles.labelDone,
              ]}
            >
              {step.label}
            </Text>
            {done ? <CompletedCheck /> : <View style={styles.checkPlaceholder} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'stretch',
    borderRadius: 24,
    padding: 10,
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPending: {
    opacity: 0.42,
  },
  iconBox: {
    width: ICON_BOX,
    height: ICON_BOX,
    borderRadius: ICON_BOX / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: CHECK_BOX,
    height: CHECK_BOX,
    borderRadius: CHECK_BOX / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CHECK_GREEN_LIGHT,
  },
  checkPlaceholder: {
    width: CHECK_BOX,
    height: CHECK_BOX,
  },
  bobbleIcon: {
    width: 22,
    height: 22,
  },
  label: {
    ...Typography.body,
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },
  labelActive: {
    fontFamily: Typography.button.fontFamily,
  },
  labelDone: {
    fontFamily: Typography.button.fontFamily,
  },
  labelPending: {
    opacity: 0.85,
  },
});
