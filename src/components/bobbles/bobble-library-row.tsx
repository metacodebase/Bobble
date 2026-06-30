import { MoreHorizontal } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BobbleIcon } from '@/src/components/ui/bobble-icon';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type BobbleLibraryRowProps = {
  title: string;
  timestamp: string;
  onPress?: () => void;
  onMenuPress?: () => void;
};

export function BobbleLibraryRow({ title, timestamp, onPress, onMenuPress }: BobbleLibraryRowProps) {
  const colors = useBobbleColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.borderLight }]}>
        <BobbleIcon size={22} variant="active" />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.timestamp, { color: colors.textSecondary }]}>{timestamp}</Text>
      </View>
      <Pressable onPress={onMenuPress} hitSlop={10} style={styles.menu}>
        <MoreHorizontal size={20} color={colors.textSecondary} strokeWidth={2} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.85,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
  },
  timestamp: {
    ...Typography.caption,
  },
  menu: {
    padding: 4,
  },
});
