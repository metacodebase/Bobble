import { CircleUserRound } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type HomeHeaderProps = {
  greeting: string;
  name: string;
  onProfilePress?: () => void;
};

export function HomeHeader({ greeting, name, onProfilePress }: HomeHeaderProps) {
  const colors = useBobbleColors();

  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>{greeting},</Text>
        <Text style={[styles.name, { color: colors.text }]}>{name} 👋</Text>
      </View>
      <Pressable
        onPress={onProfilePress}
        hitSlop={8}
        style={[styles.avatar, { backgroundColor: colors.borderLight, borderColor: colors.border }]}
      >
        <CircleUserRound size={26} color={colors.textSecondary} strokeWidth={1.8} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
