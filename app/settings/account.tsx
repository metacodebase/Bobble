import { StyleSheet, Text, View } from 'react-native';

import { ProfileAvatar } from '@/src/components/create-account/profile-avatar';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { SettingsLinkRow } from '@/src/components/settings/settings-link-row';
import {
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { PROFILE_USER } from '@/src/data/demo-data';
import { useLogout, useMe } from '@/src/hooks/api';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useAppStore } from '@/src/store/app-store';
import { Typography } from '@/src/theme/fonts';

export default function SettingsAccountScreen() {
  const colors = useBobbleColors();
  const storedUser = useAppStore((s) => s.user);
  const { data: fetchedUser } = useMe();
  const user = fetchedUser ?? storedUser;
  const logout = useLogout();
  const rawName = user?.name ?? user?.email?.split('@')[0] ?? PROFILE_USER.name;
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const displayEmail = user?.email ?? PROFILE_USER.email;

  return (
    <SettingsScreenLayout title="Account">
      <View style={styles.avatarWrap}>
        <ProfileAvatar centered={false} showCamera={false} size={100} />
        <Text style={[styles.name, { color: colors.text }]}>{displayName}</Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>{displayEmail}</Text>
      </View>

      <SettingsSection title="Profile">
        <SettingsLinkRow label="Edit profile" />
        <SettingsLinkRow label="Change password" />
        <SettingsLinkRow label="Email" value={displayEmail} isLast />
      </SettingsSection>

      <SettingsSection title="Data">
        <SettingsLinkRow label="Export my data" />
        <SettingsLinkRow label="Delete account" destructive isLast />
      </SettingsSection>

      {user ? (
        <PrimaryButton label="Sign out" onPress={() => logout.mutate()} style={styles.signOut} />
      ) : null}
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  name: {
    ...Typography.heading,
    fontSize: 22,
    lineHeight: 28,
  },
  email: {
    ...Typography.body,
  },
  signOut: {
    width: '100%',
  },
});
