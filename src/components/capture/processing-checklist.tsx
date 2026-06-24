import { Check, Circle } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
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
  const colors = useBobbleColors();

  return (
    <View style={styles.root}>
      {steps.map((step, index) => {
        const done = index < completedCount;
        const active = index === completedCount;

        return (
          <View key={step.id} style={styles.row}>
            <View
              style={[
                styles.iconWrap,
                done && { backgroundColor: colors.primary },
                active && { backgroundColor: colors.borderLight },
              ]}
            >
              {done ? (
                <Check size={16} color={colors.textOnPrimary} strokeWidth={3} />
              ) : (
                <Circle
                  size={16}
                  color={active ? colors.primary : colors.dotInactive}
                  strokeWidth={2}
                />
              )}
            </View>
            <Text
              style={[
                styles.label,
                { color: colors.textSecondary },
                done && { color: colors.text },
                active && { color: colors.primary, fontFamily: Typography.button.fontFamily },
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
  label: {
    ...Typography.body,
    flex: 1,
  },
});
