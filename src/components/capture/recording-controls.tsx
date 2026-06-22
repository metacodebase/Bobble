import { Pause, Square } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type RecordingControlsProps = {
  paused: boolean;
  onPause: () => void;
  onStop: () => void;
};

export function RecordingControls({ paused, onPause, onStop }: RecordingControlsProps) {
  return (
    <View style={styles.root}>
      <Pressable onPress={onPause} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Pause size={18} color={BobbleColors.text} strokeWidth={2.5} />
        <Text style={styles.label}>{paused ? 'Resume' : 'Pause'}</Text>
      </Pressable>

      <Pressable onPress={onStop} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Square size={16} color={BobbleColors.error} fill={BobbleColors.error} strokeWidth={0} />
        <Text style={[styles.label, styles.stopLabel]}>Stop</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 28,
    backgroundColor: BobbleColors.borderLight,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...Typography.button,
    fontSize: 16,
    color: BobbleColors.text,
  },
  stopLabel: {
    color: BobbleColors.error,
  },
});
