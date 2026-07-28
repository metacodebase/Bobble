import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const DEFAULT_ICON_SIZE = 35;

type QuickActionTileProps = {
  label: string;
  icon: ImageSource;
  iconSize?: number;
  onPress?: () => void;
};

export function QuickActionTile({
  label,
  icon,
  iconSize = DEFAULT_ICON_SIZE,
  onPress,
}: QuickActionTileProps) {
  const colors = useBobbleColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconSlot}>
        <Image
          source={icon}
          style={{ width: iconSize, height: iconSize }}
          contentFit="contain"
        />
      </View>
      <Text style={[styles.label, { color: colors.text }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    gap: 8,
    paddingHorizontal: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.88,
  },
  iconSlot: {
    width: DEFAULT_ICON_SIZE,
    height: DEFAULT_ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
});
