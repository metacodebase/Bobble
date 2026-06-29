import { MoreHorizontal } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type RecentBobbleRowProps = {
  title: string;
  timestamp: string;
  onPress?: () => void;
  onMenuPress?: () => void;
};

export function RecentBobbleRow({ title, timestamp, onPress, onMenuPress }: RecentBobbleRowProps) {
  const colors = useBobbleColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.borderLight }]}>
        <BobbleMascot variant="main" size={36} style={{ borderRadius: 18 }} />
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.9,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
    fontSize: 15,
  },
  timestamp: {
    ...Typography.caption,
  },
  menu: {
    padding: 4,
  },
});
