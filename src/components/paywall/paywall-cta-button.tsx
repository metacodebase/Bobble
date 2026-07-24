import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type PaywallCtaButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function PaywallCtaButton({
  label,
  onPress,
  loading = false,
  disabled = false,
}: PaywallCtaButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed, isDisabled && styles.disabled]}
    >
      <LinearGradient
        colors={['#7927D242', '#B76CFC']}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={BobbleColors.textOnPrimary} />
        ) : (
          <View style={styles.content}>
            <Text style={styles.label}>{label}</Text>
            <ChevronRight
              size={22}
              color={BobbleColors.textOnPrimary}
              strokeWidth={2.6}
              style={styles.chevron}
            />
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: BobbleColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 4,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.6,
  },
  gradient: {
    minHeight: 54,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.button,
    fontSize: Platform.OS === 'android' ? 18 : 16,
    lineHeight: Platform.OS === 'android' ? 21 : 20,
    color: BobbleColors.textOnPrimary,
  },
  chevron: {
    position: 'absolute',
    right: 4,
  },
});
