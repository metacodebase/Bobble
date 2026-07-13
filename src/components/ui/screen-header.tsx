import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { Typography } from '@/src/theme/fonts';

type ScreenHeaderProps = {
  title: string;
  titleColor?: string;
  compact?: boolean;
  rightIcon?: LucideIcon;
  onRightPress?: () => void;
};

export function ScreenHeader({
  title,
  titleColor,
  compact = false,
  rightIcon: RightIcon,
  onRightPress,
}: ScreenHeaderProps) {
  const colors = useBobbleColors();
  const night = useNightForeground();

  return (
    <View style={[styles.root, compact && styles.compact]}>
      <Text style={[styles.title, { color: night.text ?? titleColor ?? colors.text }]}>{title}</Text>
      {RightIcon ? (
        <Pressable onPress={onRightPress} hitSlop={12} style={styles.iconButton}>
          <RightIcon size={22} color={night.textSecondary ?? colors.textSecondary} strokeWidth={2} />
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
  compact: {
    marginBottom: 4,
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
