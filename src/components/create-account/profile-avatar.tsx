import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
import { BobbleMascot } from '../onboarding/bobble-mascot';

type ProfileAvatarProps = {
  onPress?: () => void;
};

export function ProfileAvatar({ onPress }: ProfileAvatarProps) {
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[BobbleColors.primary, BobbleColors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.avatar}
      >
        <BobbleMascot variant="sitting" size={135} style={{borderRadius: 70}}/>
      </LinearGradient>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.cameraButton, pressed && styles.cameraButtonPressed]}
      >
        <Ionicons name="camera" size={18} color={BobbleColors.textOnPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    marginVertical: 32,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cameraButton: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BobbleColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: BobbleColors.background,
  },
  cameraButtonPressed: {
    opacity: 0.85,
  },
});
