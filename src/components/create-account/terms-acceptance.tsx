import { Href, router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type TermsAcceptanceProps = {
  accepted: boolean;
  onToggle: () => void;
};

export function TermsAcceptance({ accepted, onToggle }: TermsAcceptanceProps) {
  const colors = useBobbleColors();

  return (
    <View style={styles.root}>
      <View style={styles.checkboxRow}>
        <Pressable
          onPress={onToggle}
          hitSlop={8}
          style={({ pressed }) => [pressed && styles.pressed]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: accepted }}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: colors.primary,
                backgroundColor: accepted ? colors.primary : 'transparent',
              },
            ]}
          >
            {accepted ? <Check size={14} color={colors.textOnPrimary} strokeWidth={3} /> : null}
          </View>
        </Pressable>
        <Text style={[styles.label, { color: colors.text }]}>
          I agree to the{' '}
          <Text
            style={[styles.link, { color: colors.textAccent }]}
            onPress={() => router.push('/(auth)/terms-and-conditions' as Href)}
          >
            Terms of Use
          </Text>{' '}
          and{' '}
          <Text
            style={[styles.link, { color: colors.textAccent }]}
            onPress={() => router.push('/(auth)/privacy-policy' as Href)}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  label: {
    ...Typography.caption,
    flex: 1,
    lineHeight: 20,
  },
  link: {
    ...Typography.caption,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.75,
  },
});
