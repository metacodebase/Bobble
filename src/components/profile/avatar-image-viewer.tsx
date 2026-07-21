import { Image } from 'expo-image';
import { X } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppStore } from '@/src/store/app-store';
import { buildAvatarImageSource } from '@/src/utils/avatar-url';

type AvatarImageViewerProps = {
  visible: boolean;
  avatarUrl?: string;
  onClose: () => void;
};

export function AvatarImageViewer({ visible, avatarUrl, onClose }: AvatarImageViewerProps) {
  const insets = useSafeAreaInsets();
  const authToken = useAppStore((s) => s.authToken);
  const avatarCacheKey = useAppStore((s) => s.avatarCacheKey);
  const source = buildAvatarImageSource(avatarUrl, authToken, avatarCacheKey);

  if (!source) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close photo" />

        <Pressable
          style={[styles.closeButton, { top: insets.top + 12 }]}
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <X size={24} color="#FFFFFF" strokeWidth={2.2} />
        </Pressable>

        <View style={styles.imageWrap}>
          <Image
            key={avatarCacheKey}
            source={source}
            style={styles.image}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={200}
            recyclingKey={`avatar-viewer-${avatarCacheKey}`}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  imageWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 80,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
