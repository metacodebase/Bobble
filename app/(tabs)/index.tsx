import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColor } from '@/src/hooks/use-theme-color';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');

  return (
    <View style={[styles.root, { backgroundColor: background, paddingTop: insets.top + 16 }]}>
      <Text style={[styles.title, { color: text }]}>Bobble</Text>
      <Text style={[styles.subtitle, { color: textSecondary }]}>
        Edit app/(tabs)/index.tsx to start building.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
});
