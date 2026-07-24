import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import type { PaywallFeature } from '@/src/data/paywall';
import { Typography } from '@/src/theme/fonts';

type FeatureCardProps = {
  feature: PaywallFeature;
};

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <View style={styles.card}>
      <Image source={feature.icon} style={styles.icon} contentFit="contain" />
      <Text style={styles.label}>{feature.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  icon: {
    width: 40,
    height: 40,
  },
  label: {
    ...Typography.caption,
    flex: 1,
    fontSize: 13,
    lineHeight: 17,
    color: '#2E2A87',
  },
});
