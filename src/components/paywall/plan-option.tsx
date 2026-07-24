import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PaywallPlan } from '@/src/data/paywall';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

type PlanOptionProps = {
  plan: PaywallPlan;
  selected: boolean;
  onPress: () => void;
};

export function PlanOption({ plan, selected, onPress }: PlanOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected ? styles.cardSelected : styles.cardIdle,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>

      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text style={styles.label}>{plan.label}</Text>
          {plan.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{plan.badge}</Text>
            </View>
          ) : null}
        </View>
        {plan.savingsLabel ? <Text style={styles.savings}>{plan.savingsLabel}</Text> : null}
      </View>

      <Text style={styles.price}>
        {plan.priceLabel} / {plan.period}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardSelected: {
    borderColor: BobbleColors.primary,
  },
  cardIdle: {
    borderColor: '#E8E4F0',
  },
  pressed: {
    opacity: 0.92,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: BobbleColors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BobbleColors.primary,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  label: {
    ...Typography.socialButton,
    fontSize: 16,
    lineHeight: 22,
    color: '#2E2A87',
  },
  badge: {
    backgroundColor: BobbleColors.primary,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    ...Typography.caption,
    fontSize: 10,
    lineHeight: 12,
    color: BobbleColors.textOnPrimary,
    letterSpacing: 0.3,
  },
  savings: {
    ...Typography.caption,
    fontSize: 13,
    lineHeight: 18,
    color: BobbleColors.primary,
  },
  price: {
    ...Typography.socialButton,
    fontSize: 14,
    lineHeight: 20,
    color: '#2E2A87',
  },
});
