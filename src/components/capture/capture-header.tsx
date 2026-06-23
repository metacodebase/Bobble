import { ChevronLeft, LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type CaptureHeaderProps = {
  title?: string;
  onBack?: () => void;
  rightIcon?: LucideIcon;
  onRightPress?: () => void;
  centered?: boolean;
};

export function CaptureHeader({
  title,
  onBack,
  rightIcon: RightIcon,
  onRightPress,
  centered = false,
}: CaptureHeaderProps) {
  const colors = useBobbleColors();

  return (
    <View style={styles.root}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={styles.iconButton}>
            <ChevronLeft size={28} color={colors.text} strokeWidth={2} />
          </Pressable>
        ) : null}
      </View>

      {title ? (
        <Text
          style={[styles.title, { color: colors.text }, centered && styles.titleCentered]}
          numberOfLines={1}
        >
          {title}
        </Text>
      ) : (
        <View style={styles.titleSpacer} />
      )}

      <View style={[styles.side, styles.sideRight]}>
        {RightIcon ? (
          <Pressable onPress={onRightPress} hitSlop={12} style={styles.iconButton}>
            <RightIcon size={22} color={colors.textSecondary} strokeWidth={2} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    marginBottom: 8,
  },
  side: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
    textAlign: 'left',
  },
  titleCentered: {
    textAlign: 'center',
  },
  titleSpacer: {
    flex: 1,
  },
});
