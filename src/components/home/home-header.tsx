import { Moon, Sun } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProfileAvatar } from '@/src/components/create-account/profile-avatar';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { useThemeToggle } from '@/src/hooks/use-theme-toggle';
import { Typography } from '@/src/theme/fonts';

type HomeHeaderProps = {
  greeting: string;
  name: string;
  onProfilePress?: () => void;
};

export function HomeHeader({ greeting, name, onProfilePress }: HomeHeaderProps) {
  const colors = useBobbleColors();
  const night = useNightForeground();
  const { isDark, toggle } = useThemeToggle();

  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={[styles.greeting, { color: night.textSecondary ?? colors.textSecondary }]}>
          {greeting},
        </Text>
        <Text style={[styles.name, { color: night.text ?? colors.text }]}>{name} 👋</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={toggle}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to night mode'}
          style={styles.nightToggle}
        >
          {isDark ? (
            <Sun size={22} color="#FFFFFF" strokeWidth={2.2} />
          ) : (
            <Moon size={22} color={colors.primary} strokeWidth={2.2} />
          )}
        </Pressable>

        <Pressable onPress={onProfilePress} hitSlop={8}>
          <ProfileAvatar size={48} showCamera={false} centered={false} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  greeting: {
    ...Typography.body,
    fontSize: 17,
  },
  name: {
    ...Typography.heading,
    fontSize: 30,
    lineHeight: 38,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nightToggle: {
    padding: 6,
  },
});
