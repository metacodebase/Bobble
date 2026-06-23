import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { BobbleColors } from '@/src/theme/colors';
import { Mic } from 'lucide-react-native';

const GLOW_SIZE = 220;

export function RecordingVisualizer() {
  return (
    <View style={styles.root}>
      <Svg width={GLOW_SIZE} height={GLOW_SIZE} style={styles.glow}>
        <Defs>
          <RadialGradient id="recordingGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={BobbleColors.primary} stopOpacity={0.85} />
            <Stop offset="30%" stopColor={BobbleColors.primaryLight} stopOpacity={0.65} />
            <Stop offset="55%" stopColor={BobbleColors.primaryMuted} stopOpacity={0.8} />
            <Stop offset="80%" stopColor={BobbleColors.primaryMuted} stopOpacity={0.3} />
            <Stop offset="100%" stopColor={BobbleColors.primaryMuted} stopOpacity={0.12} />
          </RadialGradient>
        </Defs>
        <Circle
          cx={GLOW_SIZE / 2}
          cy={GLOW_SIZE / 2}
          r={GLOW_SIZE / 2}
          fill="url(#recordingGlow)"
        />
      </Svg>
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
  glow: {
    position: 'absolute',
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
