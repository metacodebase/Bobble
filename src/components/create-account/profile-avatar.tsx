import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { CameraIcon } from '@/src/components/onboarding/ui-icons';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Colors } from '@/src/theme';
import { BobbleColors } from '@/src/theme/colors';
import { BobbleMascot, MascotVariant } from '../onboarding/bobble-mascot';

type ProfileAvatarProps = {
  onPress?: () => void;
  size?: number;
  showCamera?: boolean;
  centered?: boolean;
  mascotVariant?: MascotVariant;
  style?: ViewStyle;
};

export function ProfileAvatar({
  onPress,
  size = 140,
  showCamera = true,
  centered = true,
  mascotVariant = 'main',
  style,
}: ProfileAvatarProps) {
  const colors = useBobbleColors();
  const radius = size / 2;
  const mascotSize = size * (135 / 140);
  const cameraSize = size * (36 / 140);
  const cameraIcon = size * (18 / 140);
  const cameraBorder = size * (3 / 140);

  return (
    <View style={[styles.wrapper, centered && styles.wrapperCentered, style]}>
      <LinearGradient
        colors={[Colors.dark.background, Colors.light.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: radius,
          },
        ]}
      >
        <BobbleMascot variant={mascotVariant} size={mascotSize} style={{ borderRadius: radius }} />
      </LinearGradient>
      {showCamera && onPress ? (
        <Pressable
          onPress={onPress}
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
