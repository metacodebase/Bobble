import { ChevronLeft, LucideIcon, Trash2 } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { Typography } from '@/src/theme/fonts';
import { androidSafeTop } from '@/src/utils/safe-padding';

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
  /**
   * When true (default on Android), apply top safe padding so the back control
   * clears the status bar. Disable when the parent screen already pads `insets.top`.
   */
  safeTop?: boolean;
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
  safeTop = Platform.OS === 'android',
}: CaptureHeaderProps) {
  const colors = useBobbleColors();
  const night = useNightForeground();
  const insets = useSafeAreaInsets();
  const iconColor = night.text ?? colors.text;
  const mutedIconColor = night.textSecondary ?? colors.textSecondary;
  const discardColor = night.isNight ? DISCARD_COLOR : mutedIconColor;

  // Only add the inset when the parent did not already — parents typically use
  // `paddingTop: insets.top + N`. On Android, if that value was 0/too small,
  // give the back button its own clearance without double-padding common cases.
  const topPad =
    safeTop && Platform.OS === 'android' && insets.top <= 0
      ? androidSafeTop(insets.top)
      : 0;

  return (
    <View style={[styles.root, topPad > 0 && { paddingTop: topPad }]}>
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
