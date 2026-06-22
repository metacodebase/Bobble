import { StyleSheet, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';

const CONFETTI = [
  { top: '8%', left: '12%', color: BobbleColors.primary, size: 8 },
  { top: '14%', left: '78%', color: BobbleColors.success, size: 10 },
  { top: '22%', left: '32%', color: BobbleColors.warning, size: 7 },
  { top: '18%', left: '55%', color: BobbleColors.primaryLight, size: 9 },
  { top: '10%', left: '68%', color: BobbleColors.error, size: 6 },
  { top: '28%', left: '8%', color: BobbleColors.primaryMuted, size: 8 },
  { top: '6%', left: '44%', color: BobbleColors.success, size: 7 },
] as const;

export function ConfettiDecoration() {
  return (
    <View style={styles.root} pointerEvents="none">
      {CONFETTI.map((piece, index) => (
        <View
          key={index}
          style={[
            styles.piece,
            {
              top: piece.top,
              left: piece.left,
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: index % 2 === 0 ? piece.size / 2 : 2,
              transform: [{ rotate: `${index * 24}deg` }],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
  },
  piece: {
    position: 'absolute',
  },
});
