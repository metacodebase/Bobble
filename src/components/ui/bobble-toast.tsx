import { X } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast, {
  type ToastConfig,
  type ToastConfigParams,
} from 'react-native-toast-message';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { FontFamily } from '@/src/theme';

import { BobbleIcon } from './bobble-icon';

type BobbleToastKind = 'success' | 'error';

function BobbleToastCard({
  kind,
  text1,
  text2,
  hide,
}: Pick<ToastConfigParams<unknown>, 'text1' | 'text2' | 'hide'> & {
  kind: BobbleToastKind;
}) {
  const colors = useBobbleColors();
  const accentColor = kind === 'error' ? colors.error : colors.success;

  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={[styles.iconBubble, { backgroundColor: `${colors.primary}18` }]}>
        <BobbleIcon size={38} />
        <View style={[styles.statusDot, { backgroundColor: accentColor }]} />
      </View>

      <View style={styles.copy}>
        {!!text1 && <Text style={[styles.title, { color: colors.text }]}>{text1}</Text>}
        {!!text2 && <Text style={[styles.message, { color: colors.textSecondary }]}>{text2}</Text>}
      </View>

      <Pressable
        accessibilityLabel="Dismiss message"
        accessibilityRole="button"
        hitSlop={10}
        onPress={() => hide()}
        style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
      >
        <X color={colors.textSecondary} size={20} strokeWidth={2.4} />
      </Pressable>
    </View>
  );
}

export function BobbleToastHost() {
  const insets = useSafeAreaInsets();
  const config = useMemo<ToastConfig>(
    () => ({
      success: (params) => <BobbleToastCard {...params} kind="success" />,
      error: (params) => <BobbleToastCard {...params} kind="error" />,
    }),
    [],
  );

  return (
    <Toast
      config={config}
      position="top"
      topOffset={insets.top + 10}
      visibilityTime={5000}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    width: '92%',
    minHeight: 82,
    borderRadius: 24,
    borderWidth: 1,
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#32175A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  iconBubble: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusDot: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    borderColor: '#FFFFFF',
    borderWidth: 2,
  },
  copy: {
    flex: 1,
    paddingVertical: 1,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    lineHeight: 22,
    marginBottom: 2,
  },
  message: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    lineHeight: 20,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    alignSelf: 'flex-start',
  },
  closeButtonPressed: {
    opacity: 0.45,
  },
});
