import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type QuickActionTileProps = {
  label: string;
  icon: LucideIcon;
  iconColor: string;
  iconBackground: string;
  onPress?: () => void;
};

export function QuickActionTile({
  label,
  icon: Icon,
  iconColor,
  iconBackground,
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
      <View style={[styles.iconWrap, { backgroundColor: iconBackground }]}>
        <Icon size={22} color={iconColor} strokeWidth={2.2} />
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
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.88,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
});
