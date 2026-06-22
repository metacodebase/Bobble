import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type CalendarRowProps = {
  name: string;
  icon: React.ReactNode;
  onConnect?: () => void;
};

export function CalendarRow({ name, icon, onConnect }: CalendarRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.iconWrapper}>{icon}</View>
        <Text style={styles.name}>{name}</Text>
      </View>
      <Pressable onPress={onConnect} hitSlop={8}>
        {({ pressed }) => (
          <Text style={[styles.connect, pressed && styles.connectPressed]}>Connect</Text>
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
    borderBottomColor: BobbleColors.borderLight,
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
    backgroundColor: BobbleColors.borderLight,
  },
  name: {
    ...Typography.body,
    color: BobbleColors.text,
    fontFamily: Typography.input.fontFamily,
  },
  connect: {
    ...Typography.body,
    color: BobbleColors.textAccent,
    fontFamily: Typography.formLabel.fontFamily,
  },
  connectPressed: {
    opacity: 0.7,
  },
});
