import { Check } from 'lucide-react-native';
import { Platform, StyleSheet, Text, View } from 'react-native';

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

const ICON_SIZE = 28;

function StepIcon({ done, active }: { done: boolean; active: boolean }) {
  const colors = useBobbleColors();

  if (done) {
    return (
      <View style={[styles.icon, styles.iconDone, { backgroundColor: colors.primary }]}>
        <Check size={14} color={colors.textOnPrimary} strokeWidth={3} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.icon,
        {
          borderWidth: 2,
          borderColor: active ? colors.primary : colors.dotInactive,
          backgroundColor: active ? colors.borderLight : 'transparent',
        },
      ]}
    />
  );
}

export function ProcessingChecklist({ steps, completedCount }: ProcessingChecklistProps) {
  const colors = useBobbleColors();

  return (
    <View style={styles.root}>
      {steps.map((step, index) => {
        const done = index < completedCount;
        const active = index === completedCount;

        return (
          <View key={step.id} style={styles.row}>
            <StepIcon done={done} active={active} />
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
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    minWidth: ICON_SIZE,
    minHeight: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    ...(Platform.OS === 'android' ? { elevation: 0 } : null),
  },
  iconDone: {
    borderWidth: 0,
  },
  label: {
    ...Typography.body,
    flex: 1,
  },
});
