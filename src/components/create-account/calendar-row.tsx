import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type CalendarRowProps = {
  name: string;
  icon: React.ReactNode;
  onConnect?: () => void;
};

export function CalendarRow({ name, icon, onConnect }: CalendarRowProps) {
  const colors = useBobbleColors();

  return (
    <View style={[styles.row, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <View style={styles.left}>
        <View style={styles.iconWrapper}>{icon}</View>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
      </View>
      <Pressable onPress={onConnect} hitSlop={8}>
        {({ pressed }) => (
          <Text style={[styles.connect, { color: colors.textAccent }, pressed && styles.connectPressed]}>
            Connect
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 14,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...Typography.socialButton,
  },
  connect: {
    ...Typography.socialButton,
    fontFamily: Typography.formLabel.fontFamily,
  },
  connectPressed: {
    opacity: 0.7,
  },
});
