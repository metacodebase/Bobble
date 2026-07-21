import { Href, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type TermsNoticeProps = {
  /** Leading sentence before the link. */
  prefix?: string;
};

export function TermsNotice({
  prefix = 'By continuing, you agree to our',
}: TermsNoticeProps) {
  const colors = useBobbleColors();

  return (
    <View style={styles.root}>
      <Text style={[styles.prefix, { color: colors.text }]}>{prefix}</Text>
      <Pressable
        onPress={() => router.push('/(auth)/terms-and-conditions' as Href)}
        hitSlop={8}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <Text style={[styles.link, { color: colors.textAccent }]}>Terms & Conditions</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignItems: 'center',
    gap: 4,
  },
  prefix: {
    ...Typography.caption,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 14
  },
  link: {
    ...Typography.caption,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.75,
  },
});
