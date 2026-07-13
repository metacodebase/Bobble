import { ListTodo, MoreHorizontal, Pin, Share2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

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
        <Pressable
          key={index}
          onPress={onPress}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Icon size={20} color="#7C3AED" strokeWidth={2} />
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
  pressed: {
    opacity: 0.7,
  },
});
