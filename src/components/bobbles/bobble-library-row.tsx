import { MoreHorizontal } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BOBBLE_CATEGORY_STYLES } from '@/src/components/bobbles/bobble-category-config';
import type { BobbleCategory } from '@/src/data/demo-data';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { FontFamily, Typography } from '@/src/theme/fonts';

type BobbleLibraryRowProps = {
  title: string;
  timestamp: string;
  category: BobbleCategory;
  onPress?: () => void;
  onMenuPress?: () => void;
};

export function BobbleLibraryRow({
  title,
  timestamp,
  category,
  onPress,
  onMenuPress,
}: BobbleLibraryRowProps) {
  const colors = useBobbleColors();
  const night = useNightForeground();
  const categoryStyle = BOBBLE_CATEGORY_STYLES[category];
  const cardBackground = night.isNight ? 'rgba(255, 255, 255, 0.18)' : colors.surface;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: cardBackground },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.tag, { backgroundColor: categoryStyle.tagBackground }]}>
          <Text style={[styles.tagText, { color: categoryStyle.tagColor }]}>
            {categoryStyle.label}
          </Text>
        </View>
        <Text style={[styles.title, { color: night.text ?? '#1E1145' }]} numberOfLines={2}>
          {title}
        </Text>
        <Text style={[styles.timestamp, { color: night.textSecondary ?? colors.textSecondary }]}>
          {timestamp}
        </Text>
      </View>
      <Pressable onPress={onMenuPress} hitSlop={10} style={styles.menu}>
        <MoreHorizontal size={18} color={colors.primaryMuted} strokeWidth={2} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.92,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    fontSize: 10,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    lineHeight: 21,
  },
  timestamp: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    lineHeight: 15,
  },
  menu: {
    alignSelf: 'center',
    padding: 4,
  },
});
