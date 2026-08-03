import { useMemo, useState, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const MIN_SCALE = 0.55;
const MAX_SCALE = 1.35;

type PinchZoomMindMapProps = {
  children: ReactNode;
};

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

/** Scales the map and its layout height together so zooming out shortens the scroll content. */
export function PinchZoomMindMap({ children }: PinchZoomMindMapProps) {
  const [contentHeight, setContentHeight] = useState(0);
  const scale = useSharedValue(1);
  const scaleAtStart = useSharedValue(1);

  const pinch = useMemo(
    () =>
      Gesture.Pinch()
        .onStart(() => {
          scaleAtStart.value = scale.value;
        })
        .onUpdate((event) => {
          scale.value = clamp(scaleAtStart.value * event.scale, MIN_SCALE, MAX_SCALE);
        })
        .onEnd(() => {
          scaleAtStart.value = scale.value;
        }),
    [scale, scaleAtStart]
  );

  const frameStyle = useAnimatedStyle(() => ({
    height: contentHeight > 0 ? contentHeight * scale.value : undefined,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    // Scaling uses the center as its origin. This offset keeps the map's top
    // anchored while its containing frame becomes shorter or taller.
    top: contentHeight > 0 ? (-contentHeight * (1 - scale.value)) / 2 : 0,
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={pinch}>
      <Animated.View
        accessibilityLabel="Pinch with two fingers to resize the brain map"
        style={[styles.frame, frameStyle]}
      >
        <Animated.View
          onLayout={(event) => setContentHeight(event.nativeEvent.layout.height)}
          style={[styles.content, contentStyle]}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignSelf: 'stretch',
  },
  content: {
    alignItems: 'center',
    gap: 4,
  },
});
