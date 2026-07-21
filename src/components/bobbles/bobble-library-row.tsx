import { Archive, Check, Trash2 } from 'lucide-react-native';
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
  onDelete?: () => void;
  onArchive?: () => void;
  selectionMode?: boolean;
  selected?: boolean;
  onLongPress?: () => void;
  onToggleSelect?: () => void;
};

export function BobbleLibraryRow({
  title,
  timestamp,
  category,
  onPress,
  onDelete,
  onArchive,
  selectionMode = false,
  selected = false,
  onLongPress,
  onToggleSelect,
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

  const confirmArchive = () => {
    if (!onArchive) return;
    Alert.alert('Archive bobble', `Archive "${title}"?`, [
      { text: 'Cancel', style: 'cancel', onPress: () => swipeableRef.current?.close() },
      {
        text: 'Archive',
        onPress: () => {
          swipeableRef.current?.close();
          onArchive();
        },
      },
    ]);
  };

  const renderRightActions = () =>
    onDelete ? (
      <Pressable
        onPress={confirmDelete}
        style={[styles.action, { backgroundColor: colors.error }]}
      >
        <Trash2 size={20} color={colors.textOnPrimary} strokeWidth={2} />
        <Text style={[styles.actionText, { color: colors.textOnPrimary }]}>Delete</Text>
      </Pressable>
    ) : null;

  const renderLeftActions = () =>
    onArchive ? (
      <Pressable
        onPress={confirmArchive}
        style={[styles.action, { backgroundColor: colors.warning }]}
      >
        <Archive size={20} color={colors.textOnPrimary} strokeWidth={2} />
        <Text style={[styles.actionText, { color: colors.textOnPrimary }]}>Archive</Text>
      </Pressable>
    ) : null;

  const content = (
    <View style={styles.cardContainer}>
      <Pressable
        onPress={selectionMode ? onToggleSelect : onPress}
        onLongPress={selectionMode ? undefined : onLongPress}
        delayLongPress={280}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: selected ? colors.primary : 'transparent',
            borderWidth: selected ? 2 : 0,
          },
          pressed && styles.pressed,
        ]}
      >
        {selectionMode ? (
          <View
            style={[
              styles.checkbox,
              {
                borderColor: colors.primary,
                backgroundColor: selected ? colors.primary : 'transparent',
              },
            ]}
          >
            {selected ? (
              <Check size={14} color={colors.textOnPrimary} strokeWidth={3} />
            ) : null}
          </View>
        ) : null}
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
      </Pressable>
    </View>
  );

  if (!onDelete && !onArchive) return content;
  if (selectionMode) return content;

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={onDelete ? renderRightActions : undefined}
      renderLeftActions={onArchive ? renderLeftActions : undefined}
      overshootRight={false}
      overshootLeft={false}
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
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
  action: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 88,
    gap: 4,
    borderRadius: 16,
    marginVertical: 1,
  },
  actionText: {
    ...Typography.caption,
  },
});
