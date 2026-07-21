import { Pin } from 'lucide-react-native';
import { StyleSheet, View, ViewStyle } from 'react-native';

const PIN_COLOR = '#9F52F2';

type PinnedBadgeProps = {
  size?: number;
  style?: ViewStyle;
};

export function PinnedBadge({ size = 24, style }: PinnedBadgeProps) {
  const iconSize = Math.round(size * 0.52);

  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
      accessibilityLabel="Pinned"
    >
      <Pin size={iconSize} color={PIN_COLOR} strokeWidth={1.6} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'rgba(159, 82, 242, 0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(159, 82, 242, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
