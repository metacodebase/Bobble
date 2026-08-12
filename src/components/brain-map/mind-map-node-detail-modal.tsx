import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { X } from 'lucide-react-native';

import type { MindMapTaskNode } from '@/src/features/mind-map/types';
import { FontFamily, Typography } from '@/src/theme/fonts';

type MindMapNodeDetailModalProps = {
  node: MindMapTaskNode | null;
  onClose: () => void;
};

export function MindMapNodeDetailModal({ node, onClose }: MindMapNodeDetailModalProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!node) return;
    progress.setValue(0);
    Animated.spring(progress, {
      toValue: 1,
      damping: 15,
      stiffness: 180,
      mass: 0.8,
      useNativeDriver: true,
    }).start();
  }, [node, progress]);

  const close = () => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onClose();
    });
  };

  return (
    <Modal
      visible={node !== null}
      transparent
      animationType="none"
      presentationStyle="overFullScreen"
      onRequestClose={close}
    >
      <View style={styles.overlay} accessibilityViewIsModal>
        <Animated.View style={[styles.backdrop, { opacity: progress }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close node details"
            onPress={close}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        {node ? (
          <Animated.View
            style={[
              styles.card,
              { backgroundColor: node.backgroundColor ?? '#EDE9FE', opacity: progress },
              {
                transform: [
                  { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }) },
                  {
                    translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }),
                  },
                ],
              },
            ]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close node details"
              hitSlop={10}
              onPress={close}
              style={styles.closeButton}
            >
              <X size={22} color="#3B2F4A" strokeWidth={2.25} />
            </Pressable>
            <Text style={styles.title}>{node.title}</Text>
            {node.subtitle ? <Text style={styles.subtitle}>{node.subtitle}</Text> : null}
          </Animated.View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 20, 48, 0.48)',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    minHeight: 190,
    borderRadius: 24,
    paddingHorizontal: 26,
    paddingVertical: 34,
    justifyContent: 'center',
    shadowColor: '#1F1430',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  title: {
    ...Typography.heading,
    fontFamily: FontFamily.bold,
    fontSize: 24,
    lineHeight: 31,
    color: '#3B2F4A',
    paddingRight: 30,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 18,
    lineHeight: 26,
    color: '#554662',
    marginTop: 12,
  },
});
