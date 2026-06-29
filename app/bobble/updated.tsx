import { Href, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export default function BobbleUpdatedScreen() {
  const colors = useBobbleColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 24,
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Updated!</Text>
        <BobbleMascot variant="greet" size={180} />
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your Bobble has been updated successfully.
        </Text>
      </View>

      <PrimaryButton
        label="View Bobble"
        style={{width:"100%"}}
        onPress={() =>
          router.replace({ pathname: '/bobble/[id]', params: { id: id ?? '1' } } as Href)
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    ...Typography.heading,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    maxWidth: 280,
  },
});
