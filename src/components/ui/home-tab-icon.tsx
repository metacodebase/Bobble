import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

const HOME_TAB_ICON = require('@/src/assets/images/bobble-home-tab.png');

const ICON_WIDTH = 36;
const ICON_HEIGHT = ICON_WIDTH * (492 / 738);

type HomeTabIconProps = {
  focused: boolean;
};

export function HomeTabIcon({ focused }: HomeTabIconProps) {
  return (
    <View style={styles.wrapper}>
      <Image
        source={HOME_TAB_ICON}
        style={[
          styles.icon,
          focused ? styles.iconFocused : styles.iconInactive,
        ]}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ICON_WIDTH,
    height: ICON_HEIGHT,
  },
  icon: {
    width: ICON_WIDTH,
    height: ICON_HEIGHT,
  },
  iconFocused: {
    opacity: 1,
  },
  iconInactive: {
    opacity: 0.5,
  },
});
