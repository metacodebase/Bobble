import { Plus } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';

type FabButtonProps = {
  onPress: () => void;
  bottom?: number;
};

export const FAB_SIZE = 56;
export const FAB_BOTTOM_OFFSET = 16;
/** Space to reserve below scroll content so it is not hidden under the FAB. */
export const FAB_SCROLL_CLEARANCE = FAB_SIZE + FAB_BOTTOM_OFFSET + 16;

export function FabButton({ onPress, bottom = FAB_BOTTOM_OFFSET }: FabButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.fab, { bottom }, pressed && styles.pressed]}
    >
      <Plus size={28} color={BobbleColors.textOnPrimary} strokeWidth={2.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BobbleColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BobbleColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
});
