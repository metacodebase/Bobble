import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

const BOBBLE_ICON_ACTIVE = require('@/src/assets/images/bobble-tab-active.png');
const BOBBLE_ICON_INACTIVE = require('@/src/assets/images/bobble-tab-inactive.png');

const ASPECT = 49 / 52;

type BobbleIconProps = {
  size?: number;
  variant?: 'active' | 'inactive';
};

export function BobbleIcon({ size = 26, variant = 'active' }: BobbleIconProps) {
  return (
    <View style={[styles.wrapper, { width: size, height: size * ASPECT }]}>
      <Image
        source={variant === 'active' ? BOBBLE_ICON_ACTIVE : BOBBLE_ICON_INACTIVE}
        style={styles.icon}
        contentFit="fill"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  icon: {
    width: '100%',
    height: '100%',
  },
});
