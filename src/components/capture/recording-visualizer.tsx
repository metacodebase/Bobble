import { Mic } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';

const RINGS = [220, 170, 120] as const;

export function RecordingVisualizer() {
  return (
    <View style={styles.root}>
      {RINGS.map((size) => (
        <View
          key={size}
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              opacity: size === 220 ? 0.25 : size === 170 ? 0.4 : 0.55,
            },
          ]}
        />
      ))}
      <View style={styles.micWrap}>
        <Mic size={36} color={'white'} strokeWidth={2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 260,
  },
  ring: {
    position: 'absolute',
    backgroundColor: BobbleColors.primaryMuted,
  },
  micWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: BobbleColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BobbleColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
});
