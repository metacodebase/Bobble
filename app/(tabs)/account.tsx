import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLogout } from '@/src/hooks/api';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { useAppStore } from '@/src/store/app-store';
import { visibleAccountEmail, xAccountLabel } from '@/src/utils/account-identity';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const primary = useThemeColor({}, 'primary');
  const user = useAppStore((s) => s.user);
  const logout = useLogout();
  const accountIdentity = user
    ? (visibleAccountEmail(user.email) ?? xAccountLabel(user.handle))
    : undefined;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <Text style={[styles.title, { color: text }]}>Account</Text>
      <Text style={[styles.subtitle, { color: textSecondary }]}>
        {accountIdentity ? `Signed in as ${accountIdentity}` : 'Guest mode'}
      </Text>

      {user ? (
        <Pressable
          onPress={() => logout.mutate()}
          style={({ pressed }) => [
            styles.button,
            { borderColor: primary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={[styles.buttonText, { color: primary }]}>Sign out</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    width: '95%',
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    width: '95%',
    alignSelf: 'center',
  },
  button: {
    marginTop: 8,
    width: '95%',
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
