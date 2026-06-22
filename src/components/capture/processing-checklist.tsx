import { Check, Circle } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type ProcessingStep = {
  id: string;
  label: string;
};

type ProcessingChecklistProps = {
  steps: readonly ProcessingStep[];
  completedCount: number;
};

export function ProcessingChecklist({ steps, completedCount }: ProcessingChecklistProps) {
  return (
    <View style={styles.root}>
      {steps.map((step, index) => {
        const done = index < completedCount;
        const active = index === completedCount;

        return (
          <View key={step.id} style={styles.row}>
            <View style={[styles.iconWrap, done && styles.iconDone, active && styles.iconActive]}>
              {done ? (
                <Check size={16} color={BobbleColors.textOnPrimary} strokeWidth={3} />
              ) : (
                <Circle size={16} color={active ? BobbleColors.primary : BobbleColors.dotInactive} strokeWidth={2} />
              )}
            </View>
            <Text style={[styles.label, done && styles.labelDone, active && styles.labelActive]}>
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 18,
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDone: {
    backgroundColor: BobbleColors.primary,
  },
  iconActive: {
    backgroundColor: BobbleColors.borderLight,
  },
  label: {
    ...Typography.body,
    color: BobbleColors.textSecondary,
    flex: 1,
  },
  labelDone: {
    color: BobbleColors.text,
  },
  labelActive: {
    color: BobbleColors.primary,
    fontFamily: Typography.button.fontFamily,
  },
});
