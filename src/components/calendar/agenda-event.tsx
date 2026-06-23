import { StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type AgendaEventProps = {
  title: string;
  start: string;
  end: string;
};

export function AgendaEvent({ title, start, end }: AgendaEventProps) {
  const colors = useBobbleColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.borderLight }]}>
      <View style={[styles.accent, { backgroundColor: colors.primary }]} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.time, { color: colors.textSecondary }]}>
          {start} – {end}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
  },
  accent: {
    width: 4,
  },
  content: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 4,
  },
  title: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
  },
  time: {
    ...Typography.caption,
  },
});
