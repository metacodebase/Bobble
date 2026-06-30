import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { CheckIcon } from '@/src/components/onboarding/ui-icons';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type ConnectStatus = 'idle' | 'loading' | 'connected';

type CalendarRowProps = {
  name: string;
  icon: React.ReactNode;
  onConnect?: () => void;
};

const DUMMY_CONNECT_DELAY_MS = 1500;

export function CalendarRow({ name, icon, onConnect }: CalendarRowProps) {
  const colors = useBobbleColors();
  const [status, setStatus] = useState<ConnectStatus>('idle');

  const handleConnect = () => {
    if (status !== 'idle') return;

    setStatus('loading');
    onConnect?.();

    setTimeout(() => {
      setStatus('connected');
    }, DUMMY_CONNECT_DELAY_MS);
  };

  return (
    <View style={[styles.row, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <View style={styles.left}>
        <View style={styles.iconWrapper}>{icon}</View>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
      </View>
      {status === 'loading' ? (
        <ActivityIndicator size="small" color={colors.textAccent} />
      ) : status === 'connected' ? (
        <View
          style={[
            styles.connectedBadge,
            { backgroundColor: colors.success, borderColor: colors.success },
          ]}
        >
          <CheckIcon size={16} strokeWidth={4} color={colors.textOnPrimary} />
        </View>
      ) : (
        <Pressable onPress={handleConnect} hitSlop={8}>
          {({ pressed }) => (
            <Text style={[styles.connect, { color: colors.textAccent }, pressed && styles.connectPressed]}>
              Connect
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 14,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...Typography.socialButton,
  },
  connect: {
    ...Typography.socialButton,
    fontFamily: Typography.formLabel.fontFamily,
  },
  connectPressed: {
    opacity: 0.7,
  },
  connectedBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
