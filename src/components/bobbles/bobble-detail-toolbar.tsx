import { ListTodo, MoreHorizontal, Pin, Share2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';

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
  const colors = useBobbleColors();
  const actions = [
    { icon: Share2, onPress: onShare },
    { icon: ListTodo, onPress: onAddTask },
    { icon: Pin, onPress: onPin },
    { icon: MoreHorizontal, onPress: onMore },
  ];

  return (
    <View style={[styles.root, { borderTopColor: colors.border }]}>
      {actions.map(({ icon: Icon, onPress }, index) => (
        <Pressable
          key={index}
          onPress={onPress}
          style={[styles.button, { backgroundColor: colors.borderLight }]}
        >
          <Icon size={20} color={colors.textSecondary} strokeWidth={2} />
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
    marginTop: 8,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
