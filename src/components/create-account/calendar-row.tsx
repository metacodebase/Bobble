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
    <View style={[styles.row, { borderBottomColor: colors.borderLight }]}>
      <View style={styles.left}>
      <View style={[styles.iconWrapper, { backgroundColor: `${colors.primary}1A` }]}>{icon}</View>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...Typography.body,
    fontFamily: Typography.input.fontFamily,
  },
  connect: {
    ...Typography.body,
    fontFamily: Typography.formLabel.fontFamily,
  },
  connectPressed: {
    opacity: 0.7,
  },
});
