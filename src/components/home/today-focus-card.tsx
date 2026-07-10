import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const SLEEP_MASCOT = require('@/src/assets/images/bobble-sleep.png');

type TodayFocusCardProps = {
  message?: string;
};

export function TodayFocusCard({ message = 'Record your first Bobble.' }: TodayFocusCardProps) {
  const colors = useBobbleColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.primary }]}>Today's Focus</Text>
      <View style={styles.body}>
        
        <Text style={[styles.message, { color: colors.text }]}>
          {message === 'Record your first Bobble.' ? (
            <>
              Record your first <Text style={{ color: colors.primary }}>Bobble</Text>.
            </>
          ) : (
            message
          )}
        </Text>
        <Image source={SLEEP_MASCOT} style={styles.mascot} contentFit="fill" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: '100%',
    width:"49%",
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    minHeight: 150,
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    fontSize: 13,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  mascot: {
    width: '100%',
    height: '72%',
    marginLeft: 15,
  },
  message: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
    fontSize: 14,
    lineHeight: 20,
  },
});
