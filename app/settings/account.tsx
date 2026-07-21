import { Href, router } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { ProfileAvatar } from '@/src/components/create-account/profile-avatar';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { SettingsLinkRow } from '@/src/components/settings/settings-link-row';
import {
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { PROFILE_USER } from '@/src/data/demo-data';
import { useDeleteAccount, useLogout, useMe } from '@/src/hooks/api';
import { useProfile } from '@/src/hooks/profile';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { useAppStore } from '@/src/store/app-store';
import { Typography } from '@/src/theme/fonts';
import { resolveAvatarUrl } from '@/src/utils/avatar-url';

export default function SettingsAccountScreen() {
  const colors = useBobbleColors();
  const night = useNightForeground();
  const storedUser = useAppStore((s) => s.user);
  const { data: fetchedUser } = useMe();
  const { data: profile } = useProfile();
  const user = fetchedUser ?? storedUser;
  const logout = useLogout();
  const deleteAccount = useDeleteAccount();
  const rawName = user?.name ?? user?.email?.split('@')[0] ?? PROFILE_USER.name;
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const displayEmail = user?.email ?? PROFILE_USER.email;
  const avatarUrl = resolveAvatarUrl(profile?.user.avatarUrl, storedUser?.avatarUrl, user?.avatarUrl);
  const avatarSource = avatarUrl ? { uri: avatarUrl } : undefined;

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This will permanently delete your account and all your data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAccount.mutate(),
        },
      ]
    );
  };

  return (
    <SettingsScreenLayout title="Account">
      <View style={styles.avatarWrap}>
        <ProfileAvatar centered={false} showCamera={false} size={100} imageSource={avatarSource} />
        <Text style={[styles.name, { color: night.text ?? colors.text }]}>{displayName}</Text>
        <Text style={[styles.email, { color: night.textSecondary ?? colors.textSecondary }]}>
          {displayEmail}
        </Text>
      </View>

      <SettingsSection title="Profile">
        <SettingsLinkRow
          label="Edit profile"
          onPress={() => router.push('/settings/edit-profile' as Href)}
        />
        <SettingsLinkRow
          label="Change password"
          onPress={() => router.push('/settings/change-password' as Href)}
        />
        <SettingsLinkRow label="Email" value={displayEmail} isLast />
      </SettingsSection>

      <SettingsSection title="Data">
        <SettingsLinkRow
          label="Export my data"
          onPress={() => router.push('/settings/export-data' as Href)}
        />
        <SettingsLinkRow
          label={deleteAccount.isPending ? 'Deleting account…' : 'Delete account'}
          destructive
          isLast
          onPress={
            deleteAccount.isPending || logout.isPending ? undefined : confirmDeleteAccount
          }
        />
      </SettingsSection>

      {user ? (
        <PrimaryButton
          label="Sign out"
          loading={logout.isPending}
          disabled={logout.isPending || deleteAccount.isPending}
          onPress={() => logout.mutate()}
          style={styles.signOut}
        />
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
