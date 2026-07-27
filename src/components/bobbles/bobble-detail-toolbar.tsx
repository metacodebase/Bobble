import { ListTodo, MoreHorizontal, Pin, Share2 } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { androidSafeBottom } from '@/src/utils/safe-padding';

type BobbleDetailToolbarProps = {
  onShare?: () => void;
  onAddTask?: () => void;
  onPin?: () => void;
  onMore?: () => void;
  disabled?: boolean;
  pinned?: boolean;
  /** When true (default on Android), pad above the system nav bar. */
  safeBottom?: boolean;
};

export function BobbleDetailToolbar({
  onShare,
  onAddTask,
  onPin,
  onMore,
  disabled = false,
  pinned = false,
  safeBottom = Platform.OS === 'android',
}: BobbleDetailToolbarProps) {
  const insets = useSafeAreaInsets();
  const actions = [
    { id: 'share', icon: Share2, onPress: onShare, active: false },
    { id: 'tasks', icon: ListTodo, onPress: onAddTask, active: false },
    { id: 'pin', icon: Pin, onPress: onPin, active: pinned },
    { id: 'more', icon: MoreHorizontal, onPress: onMore, active: false },
  ] as const;

  const bottomPad =
    safeBottom && Platform.OS === 'android' && insets.bottom <= 0
      ? androidSafeBottom(insets.bottom)
      : 0;

  return (
    <View style={[styles.root, bottomPad > 0 && { paddingBottom: bottomPad }]}>
      {actions.map(({ id, icon: Icon, onPress, active }) => (
        <Pressable
          key={id}
          onPress={onPress}
          disabled={disabled || !onPress}
          style={({ pressed }) => [
            styles.button,
            active && styles.buttonActive,
            (pressed || disabled) && styles.pressed,
            disabled && styles.disabled,
          ]}
          accessibilityLabel={id === 'pin' ? (pinned ? 'Unpin bobble' : 'Pin bobble') : undefined}
        >
          <Icon
            size={20}
            color="#9F52F2"
            fill={active ? 'rgba(159, 82, 242, 0.18)' : 'transparent'}
            strokeWidth={active ? 1.75 : 2}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(159, 82, 242, 0.14)',
  },
  buttonActive: {
    backgroundColor: 'rgba(159, 82, 242, 0.2)',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.45,
  },
});
