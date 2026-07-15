import { MoreHorizontal, Trash2 } from 'lucide-react-native';
import { useRef } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { getBobbleCategoryStyle } from '@/src/components/bobbles/bobble-category-config';
import type { BobbleCategory } from '@/src/features/bobbles/types';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { FontFamily, Typography } from '@/src/theme/fonts';

type BobbleLibraryRowProps = {
  title: string;
  timestamp: string;
  category?: BobbleCategory | string | null;
  onPress?: () => void;
  onMenuPress?: () => void;
  onDelete?: () => void;
};

export function BobbleLibraryRow({
  title,
  timestamp,
  category,
  onPress,
  onMenuPress,
  onDelete,
}: BobbleLibraryRowProps) {
  const colors = useBobbleColors();
  const categoryStyle = getBobbleCategoryStyle(category);
  const swipeableRef = useRef<Swipeable>(null);

  const confirmDelete = () => {
    if (!onDelete) return;
    Alert.alert('Delete bobble', `Delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel', onPress: () => swipeableRef.current?.close() },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          swipeableRef.current?.close();
          onDelete();
        },
      },
    ]);
  };

  const renderRightActions = () => (
    <Pressable
      onPress={confirmDelete}
      style={[styles.deleteAction, { backgroundColor: colors.error }]}
    >
      <Trash2 size={20} color={colors.textOnPrimary} strokeWidth={2} />
      <Text style={[styles.deleteText, { color: colors.textOnPrimary }]}>Delete</Text>
    </Pressable>
  );

  const content = (
    <View style={styles.cardContainer}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: colors.surface },
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.content}>
          <View style={[styles.tag, { backgroundColor: categoryStyle.tagBackground }]}>
            <Text style={[styles.tagText, { color: categoryStyle.tagColor }]}>
              {categoryStyle.label}
            </Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {title}
          </Text>
          <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
            {timestamp}
          </Text>
        </View>
        <Pressable onPress={onMenuPress} hitSlop={10} style={styles.menu}>
          <MoreHorizontal size={20} color={colors.primaryLight} strokeWidth={2} />
        </Pressable>
      </Pressable>
    </View>
  );

  if (!onDelete) return content;

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      {content}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    backgroundColor: 'transparent',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 16,
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
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 88,
    gap: 4,
    borderRadius: 16,
    marginVertical: 1,
  },
  deleteText: {
    ...Typography.caption,
  },
});
