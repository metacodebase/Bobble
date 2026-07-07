import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

const BOBBLE_ICON_ACTIVE = require('@/src/assets/images/bobble-tab-active.png');
const BOBBLE_ICON_INACTIVE = require('@/src/assets/images/bobble-tab-inactive.png');

const ASPECT = 49 / 52;

type BobbleIconProps = {
  size?: number;
  variant?: 'active' | 'inactive';
};

export function BobbleIcon({ size = 24, variant = 'active' }: BobbleIconProps) {
  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Image
        source={variant === 'active' ? BOBBLE_ICON_ACTIVE : BOBBLE_ICON_INACTIVE}
        style={[styles.icon, { width: size, height: size * ASPECT }]}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {},
});
