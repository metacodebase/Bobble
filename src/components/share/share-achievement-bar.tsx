import { Image } from 'expo-image';
import { MoreHorizontal } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { FacebookIcon } from '@/src/components/onboarding/social-icons';

const ZAPME_ICON = require('@/src/assets/images/share/zapme.png');
const BOICE_VOX_ICON = require('@/src/assets/images/share/boice-vox.png');
const LINK_ICON = require('@/src/assets/images/share/link.png');

type ShareAchievementBarProps = {
  onFacebook?: () => void;
  onZapme?: () => void;
  onMessage?: () => void;
  onCopyLink?: () => void;
  onMore?: () => void;
};

const ICON_SIZE = 25;

export function ShareAchievementBar({
  onFacebook,
  onZapme,
  onMessage,
  onCopyLink,
  onMore,
}: ShareAchievementBarProps) {
  const actions = [
    {
      key: 'facebook',
      style: styles.iconButton,
      node: <FacebookIcon size={ICON_SIZE} />,
      onPress: onFacebook,
    },
    {
      key: 'zapme',
      style: styles.zapmeButton,
      node: <Image source={ZAPME_ICON} style={styles.zapmeIcon} contentFit="cover" />,
      onPress: onZapme,
    },
    {
      key: 'message',
      style: styles.iconButton,
      node: <Image source={BOICE_VOX_ICON} style={styles.boiceVoxIcon} contentFit="contain" />,
      onPress: onMessage,
    },
    {
      key: 'link',
      style: styles.iconButton,
      node: <Image source={LINK_ICON} style={styles.linkIcon} contentFit="contain" />,
      onPress: onCopyLink,
    },
    {
      key: 'more',
      style: styles.iconButton,
      node: <MoreHorizontal size={ICON_SIZE} color="#7C3AED" strokeWidth={2} />,
      onPress: onMore,
    },
  ];

  return (
    <View style={styles.root}>
      {actions.map(({ key, style, node, onPress }) => (
        <Pressable
          key={key}
          onPress={onPress}
          style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
        >
          {node}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  iconButton: {
    backgroundColor: '#FFFFFF',
  },
  zapmeButton: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  zapmeIcon: {
    width: 50,
    height: 50,
    borderRadius: 26,
  },
  boiceVoxIcon: {
    width: 25,
    height: 25,
  },
  linkIcon: {
    width: 25,
    height: 25,
  },
  pressed: {
    opacity: 0.85,
  },
});
