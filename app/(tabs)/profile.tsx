import { Href, router } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileAvatar } from '@/src/components/create-account/profile-avatar';
import { BadgeRow } from '@/src/components/profile/badge-row';
import { StatCard } from '@/src/components/profile/stat-card';
import { ProfileMenuRow } from '@/src/components/ui/profile-menu-row';
import { ScreenHeader } from '@/src/components/ui/screen-header';
import { GAMIFICATION, PROFILE_MENU, PROFILE_USER } from '@/src/data/demo-data';
import { useLogout } from '@/src/hooks/api';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useAppStore } from '@/src/store/app-store';
import { Typography } from '@/src/theme/fonts';

const TAB_BAR_CLEARANCE = 100;

const SETTINGS_ROUTES: Record<(typeof PROFILE_MENU)[number]['id'], Href> = {
  account: '/settings/account',
  calendar: '/settings/calendar-sync',
  connections: '/settings/connections',
  export: '/settings/export-data',
  help: '/settings/help',
  notifications: '/settings/notifications',
  about: '/settings/about',
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colors = useBobbleColors();
  const user = useAppStore((s) => s.user);
  const logout = useLogout();
  const rawName = user?.email?.split('@')[0] ?? PROFILE_USER.name;
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const displayHandle = user?.email ? `@${user.email.split('@')[0]}` : PROFILE_USER.handle;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, backgroundColor: colors.background }]}>
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
      <View style={[styles.heroCard, { backgroundColor: colors.borderLight }]}>
        <ProfileAvatar size={140} style={styles.avatar} onPress={() => {}} />
        <Text style={[styles.name, { color: colors.text }]}>{displayName}</Text>
        <Text style={[styles.handle, { color: colors.textSecondary }]}>{displayHandle}</Text>

        <View style={styles.statsRow}>
          <StatCard compact label="Streak" value={GAMIFICATION.stats.streak} />
          <StatCard compact label="Bobbles" value={GAMIFICATION.stats.bobbles} />
          <StatCard compact label="Tasks" value={GAMIFICATION.stats.tasks} />
          <StatCard compact label="XP" value={GAMIFICATION.stats.xp} />
        </View>
      </View>

      <BadgeRow />

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
          label="Log Out"
          icon="user"
          destructive
          onPress={() => {
            if (user) {
              logout.mutate();
            }
          }}
        />
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  content: {
    paddingHorizontal: 24,
  },
  heroCard: {
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
    marginBottom: 4,
  },
  handle: {
    ...Typography.body,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  menu: {
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});
