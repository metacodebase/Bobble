import { Pause, Square } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type RecordingControlsProps = {
  paused: boolean;
  onPause: () => void;
  onStop: () => void;
};

export function RecordingControls({ paused, onPause, onStop }: RecordingControlsProps) {
  const colors = useBobbleColors();

  return (
    <View style={styles.root}>
      <Pressable
        onPress={onPause}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.borderLight },
          pressed && styles.pressed,
        ]}
      >
        <Pause size={18} color={colors.text} strokeWidth={2.5} />
        <Text style={[styles.label, { color: colors.text }]}>{paused ? 'Resume' : 'Pause'}</Text>
      </Pressable>

      <Pressable
        onPress={onStop}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.borderLight },
          pressed && styles.pressed,
        ]}
      >
        <Square size={16} color={colors.error} fill={colors.error} strokeWidth={0} />
        <Text style={[styles.label, { color: colors.error }]}>Stop</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 32,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...Typography.button,
    fontSize: 16,
  },
});
