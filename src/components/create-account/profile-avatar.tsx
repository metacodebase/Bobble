import { Image, ImageSource } from 'expo-image';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { CameraIcon } from '@/src/components/onboarding/ui-icons';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { BobbleColors } from '@/src/theme/colors';

const DEFAULT_PROFILE_IMAGE = require('@/src/assets/images/profile-avatar-default.png');

type ProfileAvatarProps = {
  onPress?: () => void;
  size?: number;
  showCamera?: boolean;
  centered?: boolean;
  imageSource?: ImageSource;
  style?: ViewStyle;
};

export function ProfileAvatar({
  onPress,
  size = 140,
  showCamera = true,
  centered = true,
  imageSource = DEFAULT_PROFILE_IMAGE,
  style,
}: ProfileAvatarProps) {
  const colors = useBobbleColors();
  const radius = size / 2;
  const cameraSize = size * (36 / 140);
  const cameraIcon = size * (18 / 140);
  const cameraBorder = size * (3 / 140);

  return (
    <View style={[styles.wrapper, centered && styles.wrapperCentered, style]}>
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: radius,
          },
        ]}
      >
        <Image
          source={imageSource}
          style={{ width: size, height: size, borderRadius: radius }}
          contentFit="cover"
        />
      </View>
      {showCamera ? (
        <Pressable
          onPress={onPress}
          disabled={!onPress}
          style={({ pressed }) => [
            styles.cameraButton,
            {
              width: cameraSize,
              height: cameraSize,
              borderRadius: cameraSize / 2,
              borderWidth: cameraBorder,
              borderColor: colors.background,
              right: size * (4 / 140),
              bottom: size * (4 / 140),
            },
            pressed && styles.cameraButtonPressed,
          ]}
        >
          <CameraIcon size={cameraIcon} color={BobbleColors.textOnPrimary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  wrapperCentered: {
    alignSelf: 'center',
    marginVertical: 32,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cameraButton: {
    position: 'absolute',
    backgroundColor: BobbleColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButtonPressed: {
    opacity: 0.85,
  },
});
