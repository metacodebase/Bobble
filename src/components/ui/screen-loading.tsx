import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { Typography } from '@/src/theme/fonts';

type ScreenLoadingProps = {
  label?: string;
  compact?: boolean;
};

export function ScreenLoading({ label = 'Loading…', compact = false }: ScreenLoadingProps) {
  const colors = useBobbleColors();
  const night = useNightForeground();

  return (
    <View style={[styles.root, compact && styles.compact]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {label ? (
        <Text style={[styles.label, { color: night.textSecondary ?? colors.textSecondary }]}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  compact: {
    flex: 0,
    paddingVertical: 32,
  },
  label: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
