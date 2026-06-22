import { MoreHorizontal, Sparkles } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type BobbleLibraryRowProps = {
  title: string;
  timestamp: string;
  onPress?: () => void;
  onMenuPress?: () => void;
};

export function BobbleLibraryRow({ title, timestamp, onPress, onMenuPress }: BobbleLibraryRowProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.iconWrap}>
        <Sparkles size={18} color={BobbleColors.primary} strokeWidth={2} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
      <Pressable onPress={onMenuPress} hitSlop={10} style={styles.menu}>
        <MoreHorizontal size={20} color={BobbleColors.textSecondary} strokeWidth={2} />
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
    borderBottomColor: BobbleColors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: BobbleColors.borderLight,
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
    color: BobbleColors.text,
  },
  timestamp: {
    ...Typography.caption,
    color: BobbleColors.textSecondary,
  },
  menu: {
    padding: 4,
  },
});
