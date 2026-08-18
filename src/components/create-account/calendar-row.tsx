import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { CheckIcon } from '@/src/components/onboarding/ui-icons';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export type ConnectStatus = 'idle' | 'loading' | 'connected';

type CalendarRowProps = {
  name: string;
  icon: React.ReactNode;
  onConnect?: () => void;
  status?: ConnectStatus;
  buttonLabel?: string;
};

const DUMMY_CONNECT_DELAY_MS = 1500;

export function CalendarRow({ name, icon, onConnect, status: externalStatus, buttonLabel = 'Connect' }: CalendarRowProps) {
  const colors = useBobbleColors();
  const [internalStatus, setInternalStatus] = useState<ConnectStatus>('idle');

  // Use external status if provided, otherwise use internal state
  const isControlled = externalStatus !== undefined;
  const currentStatus = isControlled ? externalStatus : internalStatus;

  const handleConnect = () => {
    if (currentStatus === 'loading') return;

    if (!isControlled && currentStatus === 'idle') {
      setInternalStatus('loading');
      setTimeout(() => {
        setInternalStatus('connected');
      }, DUMMY_CONNECT_DELAY_MS);
    }
    
    onConnect?.();
  };

  return (
    <View style={[styles.row, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <View style={styles.left}>
        <View style={styles.iconWrapper}>{icon}</View>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>
      </View>
      {currentStatus === 'loading' ? (
        <ActivityIndicator size="small" color={colors.textAccent} />
      ) : currentStatus === 'connected' ? (
        <Pressable onPress={handleConnect} hitSlop={8}>
          <View
            style={[
              styles.connectedBadge,
              { backgroundColor: colors.success, borderColor: colors.success },
            ]}
          >
            <CheckIcon size={16} strokeWidth={4} color={colors.textOnPrimary} />
          </View>
        </Pressable>
      ) : (
        <Pressable onPress={handleConnect} hitSlop={8}>
          {({ pressed }) => (
            <Text style={[styles.connect, { color: colors.textAccent }, pressed && styles.connectPressed]}>
              {buttonLabel}
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
    width: '100%',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    paddingRight: 16,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...Typography.socialButton,
    flexShrink: 1,
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
