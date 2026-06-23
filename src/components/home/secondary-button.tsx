import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
  style?: ViewStyle;
};

export function SecondaryButton({ label, onPress, icon: Icon, style }: SecondaryButtonProps) {
  const colors = useBobbleColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? colors.borderLight : colors.surface,
          borderColor: colors.primary,
        },
        style,
      ]}
    >
      {Icon ? (
        <View style={styles.icon}>
          <Icon size={20} color={colors.primary} strokeWidth={2} />
        </View>
      ) : null}
      <Text style={[styles.label, { color: colors.primary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 32,
    borderWidth: 1.5,
    paddingVertical: 18,
    width: '100%',
  },
  icon: {
    marginTop: 1,
  },
  label: {
    ...Typography.button,
  },
});
