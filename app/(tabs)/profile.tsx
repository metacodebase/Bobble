import { Href, router } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { ProfileAvatar } from '@/src/components/create-account/profile-avatar';
import { AvatarImageViewer } from '@/src/components/profile/avatar-image-viewer';
import { ActionSheet } from '@/src/components/ui/action-sheet';
import { StatCard } from '@/src/components/profile/stat-card';
import { ProfileMenuRow } from '@/src/components/ui/profile-menu-row';
import { ScreenHeader } from '@/src/components/ui/screen-header';
import { PROFILE_MENU, PROFILE_USER } from '@/src/data/demo-data';
import { useLogout, useMe } from '@/src/hooks/api';
import { useProfile } from '@/src/hooks/profile';
import { useProfileAvatarPicker } from '@/src/hooks/use-profile-avatar-picker';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useAppStore } from '@/src/store/app-store';
import { Typography } from '@/src/theme/fonts';
import { resolveAvatarUrl } from '@/src/utils/avatar-url';

const TAB_BAR_CLEARANCE = 100;

const SETTINGS_ROUTES: Record<(typeof PROFILE_MENU)[number]['id'], Href> = {
  account: '/settings/account',
  calendar: '/settings/calendar-sync',
  connections: '/settings/connections',
  export: '/settings/export-data',
  help: '/settings/help',
  billing: '/settings/billing',
  notifications: '/settings/notifications',
  about: '/settings/about',
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colors = useBobbleColors();
  const storedUser = useAppStore((s) => s.user);
  const { data: fetchedUser, refetch } = useMe();
  const { data: profile, refetch: refetchProfile } = useProfile();
  const user = fetchedUser ?? storedUser;
  const logout = useLogout();
  const { openPicker, isUploading, localPreviewUri, sheetProps } = useProfileAvatarPicker();
  const [viewerOpen, setViewerOpen] = useState(false);
  const rawName = user?.name ?? user?.email?.split('@')[0] ?? PROFILE_USER.name;
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const avatarUrl = resolveAvatarUrl(
    profile?.user.avatarUrl,
    storedUser?.avatarUrl,
    user?.avatarUrl,
  );
  const avatarSource = localPreviewUri
    ? { uri: localPreviewUri }
    : avatarUrl
      ? { uri: avatarUrl }
      : undefined;

  const handleAvatarPress = useCallback(() => {
    if (avatarUrl) {
      setViewerOpen(true);
      return;
    }
    openPicker();
  }, [avatarUrl, openPicker]);

  const gamification = user?.gamification;

  useFocusEffect(
    useCallback(() => {
      void refetch();
      void refetchProfile();
    }, [refetch, refetchProfile]),
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <ScreenHeader
          title="Profile"
          rightIcon={Settings}
          onRightPress={() => router.push('/settings' as Href)}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + TAB_BAR_CLEARANCE },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.surface }]}>
          <ProfileAvatar
            size={140}
            style={styles.avatar}
            imageSource={avatarSource}
            uploading={isUploading}
            onPress={handleAvatarPress}
            onCameraPress={openPicker}
          />
          <Text style={[styles.name, { color: colors.text }]}>{displayName}</Text>

          <View style={styles.statsRow}>
            <StatCard compact label="Bobbles" value={gamification?.bobbles ?? 0} />
            <StatCard compact label="Tasks" value={gamification?.tasks ?? 0} />
          </View>
        </View>
        <View style={[styles.menu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {PROFILE_MENU.map((item) => (
            <ProfileMenuRow
              key={item.id}
              label={item.label}
              icon={item.icon}
              onPress={() => router.push(SETTINGS_ROUTES[item.id])}
            />
          ))}
          <ProfileMenuRow
            label={logout.isPending ? 'Signing out…' : 'Log Out'}
            icon="user"
            destructive
            onPress={() => {
              if (user && !logout.isPending) {
                logout.mutate();
              }
            }}
          />
        </View>
      </ScrollView>

      <ActionSheet {...sheetProps} />
      <AvatarImageViewer
        visible={viewerOpen}
        avatarUrl={avatarUrl}
        onClose={() => setViewerOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  content: {
    paddingHorizontal: 16,
  },
  heroCard: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    marginVertical: 20,
  },
  name: {
    ...Typography.heading,
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 20,
    width: '95%',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  badgeWrap: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 24,
  },
  menu: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});
