import { ListTodo, MoreHorizontal, Pin, Share2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';

type BobbleDetailToolbarProps = {
  onShare?: () => void;
  onAddTask?: () => void;
  onPin?: () => void;
  onMore?: () => void;
};

export function BobbleDetailToolbar({
  onShare,
  onAddTask,
  onPin,
  onMore,
}: BobbleDetailToolbarProps) {
  const actions = [
    { icon: Share2, onPress: onShare },
    { icon: ListTodo, onPress: onAddTask },
    { icon: Pin, onPress: onPin },
    { icon: MoreHorizontal, onPress: onMore },
  ];

  return (
    <View style={styles.root}>
      {actions.map(({ icon: Icon, onPress }, index) => (
        <Pressable key={index} onPress={onPress} style={styles.button}>
          <Icon size={20} color={BobbleColors.textSecondary} strokeWidth={2} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BobbleColors.border,
    marginTop: 8,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BobbleColors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
