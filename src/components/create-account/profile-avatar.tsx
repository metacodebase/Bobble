import { Image, ImageSource } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { CameraIcon } from '@/src/components/onboarding/ui-icons';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useAppStore } from '@/src/store/app-store';
import { BobbleColors } from '@/src/theme/colors';
import { buildAvatarImageSource, resolveAvatarUrl } from '@/src/utils/avatar-url';

const DEFAULT_PROFILE_IMAGE = require('@/src/assets/images/profile-avatar-default.png');

type ProfileAvatarProps = {
  onPress?: () => void;
  onCameraPress?: () => void;
  size?: number;
  showCamera?: boolean;
  centered?: boolean;
  imageSource?: ImageSource;
  uploading?: boolean;
  style?: ViewStyle;
};

export function ProfileAvatar({
  onPress,
  onCameraPress,
  size = 140,
  showCamera = true,
  centered = true,
  imageSource,
  uploading = false,
  style,
}: ProfileAvatarProps) {
  const colors = useBobbleColors();
  const authToken = useAppStore((s) => s.authToken);
  const [loadFailed, setLoadFailed] = useState(false);
  const radius = size / 2;
  const cameraSize = size * (36 / 140);
  const cameraIcon = size * (18 / 140);
  const cameraBorder = size * (3 / 140);
  const remoteUri =
    typeof imageSource === 'object' && imageSource && 'uri' in imageSource
      ? imageSource.uri
      : undefined;
  const validRemoteUri = resolveAvatarUrl(remoteUri);
  const handleCameraPress = onCameraPress ?? onPress;

  const resolvedSource = useMemo(() => {
    if (!validRemoteUri || loadFailed) return DEFAULT_PROFILE_IMAGE;
    return buildAvatarImageSource(validRemoteUri, authToken) ?? DEFAULT_PROFILE_IMAGE;
  }, [authToken, loadFailed, validRemoteUri]);

  useEffect(() => {
    setLoadFailed(false);
  }, [validRemoteUri, authToken]);

  return (
    <View style={[styles.wrapper, centered && styles.wrapperCentered, style]}>
      <Pressable
        onPress={onPress}
        disabled={!onPress || uploading}
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: colors.border,
          },
        ]}
      >
        <Image
          key={`${validRemoteUri ?? 'default'}-${loadFailed ? 'fallback' : 'remote'}`}
          source={resolvedSource}
          style={{ width: size, height: size, borderRadius: radius }}
          contentFit="cover"
          cachePolicy={validRemoteUri && !loadFailed ? 'none' : 'memory-disk'}
          onLoad={() => setLoadFailed(false)}
          onError={() => setLoadFailed(true)}
        />
        {uploading ? (
          <View style={[styles.uploadOverlay, { borderRadius: radius }]}>
            <ActivityIndicator color="#FFFFFF" />
          </View>
        ) : null}
      </Pressable>
      {showCamera ? (
        <Pressable
          onPress={handleCameraPress}
          disabled={!handleCameraPress || uploading}
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
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
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
