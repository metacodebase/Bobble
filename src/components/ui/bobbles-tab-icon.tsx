import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

const BOBBLES_TAB_ICON_ACTIVE = require('@/src/assets/images/bobble-tab-active.png');
const BOBBLES_TAB_ICON_INACTIVE = require('@/src/assets/images/bobble-tab-inactive.png');

const ICON_WIDTH = 26;
const ICON_HEIGHT = ICON_WIDTH * (49 / 52);

type BobblesTabIconProps = {
  focused: boolean;
};

export function BobblesTabIcon({ focused }: BobblesTabIconProps) {
  return (
    <View style={styles.wrapper}>
      <Image
        source={focused ? BOBBLES_TAB_ICON_ACTIVE : BOBBLES_TAB_ICON_INACTIVE}
        style={styles.icon}
        contentFit="fill"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: ICON_WIDTH,
    height: ICON_HEIGHT,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
});
