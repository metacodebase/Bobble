import { StyleSheet, Text, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type AgendaEventProps = {
  title: string;
  start: string;
  end: string;
};

export function AgendaEvent({ title, start, end }: AgendaEventProps) {
  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>
          {start} – {end}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: BobbleColors.borderLight,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
  },
  accent: {
    width: 4,
    backgroundColor: BobbleColors.primary,
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
    color: BobbleColors.text,
  },
  time: {
    ...Typography.caption,
    color: BobbleColors.textSecondary,
  },
});
