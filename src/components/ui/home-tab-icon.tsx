import { Image, ImageSource } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { useHomeHeartIntro } from '@/src/hooks/use-home-heart-intro';

const HOME_TAB_ICON = require('@/src/assets/images/bobble-home-tab.png');
const HOME_TAB_ICON_ANIMATED = require('@/src/assets/images/bobble-home-tab-animated.webp');

const ICON_WIDTH = 36;
const ICON_HEIGHT = ICON_WIDTH * (492 / 738);

type HomeTabIconProps = {
  focused: boolean;
};

export function HomeTabIcon({ focused }: HomeTabIconProps) {
  const { playIntro, replayKey } = useHomeHeartIntro(focused);
  const source: ImageSource = playIntro ? HOME_TAB_ICON_ANIMATED : HOME_TAB_ICON;

  return (
    <View style={styles.wrapper}>
      <Image
        key={playIntro ? `home-heart-${replayKey}` : 'home-heart-static'}
        source={source}
        style={[styles.icon, focused ? styles.iconFocused : styles.iconInactive]}
        contentFit="contain"
        {...(playIntro ? { useAppleWebpCodec: false } : {})}
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
