import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProfileAvatar } from '@/src/components/create-account/profile-avatar';
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
      <Pressable onPress={onProfilePress} hitSlop={8}>
        <ProfileAvatar size={48} showCamera={false} centered={false} />
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
});
