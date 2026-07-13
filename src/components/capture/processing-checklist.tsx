import { Image } from 'expo-image';
import { Ear, Lightbulb, List } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const PROCESSING_TEXT = '#17164B';
const BOBBLE_ICON = require('@/src/assets/images/bobble-tab-active.png');

export type ProcessingStep = {
  id: string;
  label: string;
  icon: 'ear' | 'list' | 'lightbulb' | 'bobble';
};

type ProcessingChecklistProps = {
  steps: readonly ProcessingStep[];
  completedCount: number;
};

const ICON_BOX = 36;

function StepIcon({
  type,
  highlighted,
}: {
  type: ProcessingStep['icon'];
  highlighted: boolean;
}) {
  const colors = useBobbleColors();
  const iconColor = highlighted ? colors.textOnPrimary : colors.primary;

  return (
    <View
      style={[
        styles.iconBox,
        {
          backgroundColor: colors.primary + '18',
        },
      ]}
    >
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

export function ProcessingChecklist({ steps, completedCount }: ProcessingChecklistProps) {
  const colors = useBobbleColors();

  return (
    <View style={[styles.container, { backgroundColor: `${colors.primary}14` }]}>
      {steps.map((step, index) => {
        const done = index < completedCount;
        const active = index === completedCount;
        const pending = index > completedCount;
        const highlighted = done || active;

        return (
          <View
            key={step.id}
            style={[styles.card, pending && styles.cardPending]}
          >
            <StepIcon type={step.icon} highlighted={highlighted} />
            <Text
              style={[
                styles.label,
                { color: PROCESSING_TEXT },
                pending && styles.labelPending,
                (done || active) && styles.labelActive,
              ]}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
  labelPending: {
    opacity: 0.85,
  },
});
