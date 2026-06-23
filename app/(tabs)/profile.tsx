import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileAvatar } from '@/src/components/create-account/profile-avatar';
import { BobbleMascot } from '@/src/components/onboarding/bobble-mascot';
import { BadgeRow } from '@/src/components/profile/badge-row';
import { GamificationHeader } from '@/src/components/profile/gamification-header';
import { StatCard } from '@/src/components/profile/stat-card';
import { ProfileMenuRow } from '@/src/components/ui/profile-menu-row';
import { GAMIFICATION, PROFILE_MENU, PROFILE_USER } from '@/src/data/demo-data';
import { useLogout } from '@/src/hooks/api';
import { useAppStore } from '@/src/store/app-store';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const user = useAppStore((s) => s.user);
  const logout = useLogout();
  const displayName = user?.email?.split('@')[0] ?? PROFILE_USER.name;
  const displayEmail = user?.email ?? PROFILE_USER.email;

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileHeader}>
        <ProfileAvatar centered={false} />
        <View style={styles.profileText}>
          <Text style={styles.name}>{displayName.charAt(0).toUpperCase() + displayName.slice(1)}</Text>
          <Text style={styles.email}>{displayEmail}</Text>
        </View>
      </View>

      <GamificationHeader />

      <View style={styles.statsRow}>
        <StatCard label="Bobbles" value={GAMIFICATION.stats.bobbles} />
        <StatCard label="Tasks Done" value={GAMIFICATION.stats.tasksDone} />
        <StatCard label="Streak" value={`${GAMIFICATION.stats.streakDays} days`} />
      </View>

      <BadgeRow />

      <View style={styles.motivation}>
        <BobbleMascot variant="sitting" size={48} />
        <Text style={styles.motivationText}>Keep going! You're doing amazing</Text>
      </View>

      <View style={styles.menu}>
        {PROFILE_MENU.map((item) => (
          <ProfileMenuRow key={item.id} label={item.label} icon={item.icon} />
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
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BobbleColors.background,
  },
  content: {
    paddingHorizontal: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  profileText: {
    flex: 1,
    gap: 4,
  },
  name: {
    ...Typography.heading,
    fontSize: 24,
    lineHeight: 32,
    color: BobbleColors.text,
  },
  email: {
    ...Typography.body,
    color: BobbleColors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  motivation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: BobbleColors.borderLight,
    borderRadius: 16,
    padding: 14,
    marginBottom: 24,
  },
  motivationText: {
    ...Typography.body,
    color: BobbleColors.text,
    flex: 1,
  },
  menu: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BobbleColors.border,
  },
});
