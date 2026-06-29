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
        <View
          key={index}
          style={[styles.dot, index === activeIndex ? styles.dotActive : styles.dotInactive]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: BobbleColors.dotActive,
  },
  dotInactive: {
    backgroundColor: BobbleColors.dotInactive,
  },
});
