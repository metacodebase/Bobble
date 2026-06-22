import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeColor } from '@/src/hooks/use-theme-color';

export default function NotFoundScreen() {
  const text = useThemeColor({}, 'text');
  const primary = useThemeColor({}, 'primary');

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={[styles.title, { color: text }]}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: primary }]}>Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
