import { StyleSheet, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';

type PaginationDotsProps = {
  total: number;
  activeIndex: number;
};

export function PaginationDots({ total, activeIndex }: PaginationDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View key={index} style={styles.dotSlot}>
          <View
            style={[styles.dot, index === activeIndex ? styles.dotActive : styles.dotInactive]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dotSlot: {
    width: 24,
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: BobbleColors.dotActive,
    width: 24,
    borderRadius: 4,
  },
  dotInactive: {
    backgroundColor: BobbleColors.dotInactive,
  },
});
