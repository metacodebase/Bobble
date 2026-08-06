import { Image } from 'expo-image';
import { Check, Ear, Lightbulb, List } from 'lucide-react-native';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

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

type ChecklistSizing = {
  iconBox: number;
  checkBox: number;
  iconSize: number;
  checkSize: number;
  bobbleIcon: number;
};

function StepIcon({
  type,
  sizing,
}: {
  type: ProcessingStep['icon'];
  sizing: ChecklistSizing;
}) {
  const colors = useBobbleColors();

  return (
    <View
      style={[
        styles.iconBox,
        {
          width: sizing.iconBox,
          height: sizing.iconBox,
          borderRadius: 100,
          backgroundColor: `${colors.primary}18`,
          overflow: 'hidden',
        },
      ]}
    >
      {type === 'ear' ? (
        <Ear size={sizing.iconSize} color={colors.primaryLight} strokeWidth={2.2} />
      ) : type === 'list' ? (
        <List size={sizing.iconSize} color={colors.primaryLight} strokeWidth={2.2} />
      ) : type === 'lightbulb' ? (
        <Lightbulb size={sizing.iconSize} color={colors.primaryLight} strokeWidth={2.2} />
      ) : (
        <Image
          source={BOBBLE_ICON}
          style={{ width: sizing.bobbleIcon, height: sizing.bobbleIcon }}
          contentFit="contain"
        />
      )}
    </View>
  );
}

function CompletedCheck({ sizing }: { sizing: ChecklistSizing }) {
  return (
    <View
      style={[
        styles.checkCircle,
        {
          width: sizing.checkBox,
          height: sizing.checkBox,
          borderRadius: sizing.checkBox / 2,
        },
      ]}
    >
      <Check size={sizing.checkSize} color={CHECK_GREEN} strokeWidth={3} />
    </View>
  );
}

export function ProcessingChecklist({
  steps,
  completedCount,
  revealedCount,
}: ProcessingChecklistProps) {
  const colors = useBobbleColors();
  const { width: screenWidth } = useWindowDimensions();
  const scale = Math.min(1.12, Math.max(0.9, screenWidth / 390));
  const sizing: ChecklistSizing = {
    iconBox: Math.round(36 * scale),
    checkBox: Math.round(26 * scale),
    iconSize: Math.round(18 * scale),
    checkSize: Math.round(13 * scale),
    bobbleIcon: Math.round(22 * scale),
  };

  return (
    <View style={[styles.container, { backgroundColor: `${colors.primary}14` }]}>
      {steps.map((step, index) => {
        const done = index < revealedCount;
        const pending = index > completedCount;
        const active = !done && !pending;

        return (
          <View key={step.id} style={[styles.card, pending && styles.cardPending]}>
            <StepIcon type={step.icon} sizing={sizing} />
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
            {done ? (
              <CompletedCheck sizing={sizing} />
            ) : (
              <View style={{ width: sizing.checkBox, height: sizing.checkBox }} />
            )}
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
    paddingVertical: 10,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CHECK_GREEN_LIGHT,
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
