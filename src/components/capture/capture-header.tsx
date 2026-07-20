import { ChevronLeft, LucideIcon, Trash2 } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { Typography } from '@/src/theme/fonts';

const DISCARD_COLOR = '#FDEAC2';

type CaptureHeaderProps = {
  title?: string;
  onBack?: () => void;
  leftLabel?: string;
  onLeftPress?: () => void;
  rightIcon?: LucideIcon;
  onRightPress?: () => void;
  centered?: boolean;
  titleColor?: string;
};

export function CaptureHeader({
  title,
  onBack,
  leftLabel,
  onLeftPress,
  rightIcon: RightIcon,
  onRightPress,
  centered = false,
  titleColor,
}: CaptureHeaderProps) {
  const colors = useBobbleColors();
  const night = useNightForeground();
  const iconColor = night.text ?? colors.text;
  const mutedIconColor = night.textSecondary ?? colors.textSecondary;
  const discardColor = night.isNight ? DISCARD_COLOR : mutedIconColor;

  return (
    <View style={styles.root}>
      <View style={[styles.side, leftLabel ? styles.sideWide : null]}>
        {leftLabel ? (
          <Pressable onPress={onLeftPress} hitSlop={12} style={styles.iconButton}>
            <View style={styles.leftLabelRow}>
              <Trash2 size={18} color={discardColor} strokeWidth={2} />
              <Text style={[styles.leftLabel, { color: discardColor }]}>{leftLabel}</Text>
            </View>
          </Pressable>
        ) : onBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={styles.iconButton}>
            <ChevronLeft size={28} color={iconColor} strokeWidth={2} />
          </Pressable>
        ) : null}
      </View>

      {title ? (
        centered ? (
          <Text
            style={[styles.titleCentered, { color: night.text ?? titleColor ?? colors.text }]}
            numberOfLines={1}
            pointerEvents="none"
          >
            {title}
          </Text>
        ) : (
          <Text style={[styles.title, { color: night.text ?? titleColor ?? colors.text }]} numberOfLines={1}>
            {title}
          </Text>
        )
      ) : (
        <View style={styles.titleSpacer} />
      )}

      <View style={[styles.side, styles.sideRight]}>
        {RightIcon ? (
          <Pressable onPress={onRightPress} hitSlop={12} style={styles.iconButton}>
            <RightIcon size={22} color={mutedIconColor} strokeWidth={2} />
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
    justifyContent: 'space-between',
    width: '100%',
    minHeight: 44,
    marginBottom: 8,
  },
  side: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 1,
  },
  sideWide: {
    width: 'auto',
  },
  leftLabel: {
    ...Typography.formLabel,
  },
  leftLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    position: 'absolute',
    left: 0,
    right: 0,
    ...Typography.heading,
    fontSize: 20,
    textAlign: 'center',
  },
  titleSpacer: {
    flex: 1,
  },
});
