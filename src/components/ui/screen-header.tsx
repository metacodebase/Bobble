import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type ScreenHeaderProps = {
  title: string;
  rightIcon?: LucideIcon;
  onRightPress?: () => void;
};

export function ScreenHeader({ title, rightIcon: RightIcon, onRightPress }: ScreenHeaderProps) {
  const colors = useBobbleColors();

  return (
    <View style={styles.root}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {RightIcon ? (
        <Pressable onPress={onRightPress} hitSlop={12} style={styles.iconButton}>
          <RightIcon size={22} color={colors.textSecondary} strokeWidth={2} />
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    ...Typography.heading,
    fontSize: 28,
    lineHeight: 36,
  },
  iconButton: {
    padding: 4,
  },
  spacer: {
    width: 30,
  },
});
