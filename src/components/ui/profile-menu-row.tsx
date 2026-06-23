import {
  Bell,
  Calendar,
  ChevronRight,
  Globe,
  HelpCircle,
  Info,
  Link2,
  LucideIcon,
  Palette,
  User,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const ICONS: Record<string, LucideIcon> = {
  user: User,
  calendar: Calendar,
  link: Link2,
  bell: Bell,
  palette: Palette,
  globe: Globe,
  help: HelpCircle,
  info: Info,
};

type ProfileMenuRowProps = {
  label: string;
  icon: string;
  onPress?: () => void;
  destructive?: boolean;
};

export function ProfileMenuRow({ label, icon, onPress, destructive }: ProfileMenuRowProps) {
  const colors = useBobbleColors();
  const Icon = ICONS[icon] ?? User;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.left}>
        <Icon
          size={20}
          color={destructive ? colors.error : colors.textSecondary}
          strokeWidth={2}
        />
        <Text
          style={[
            styles.label,
            { color: destructive ? colors.error : colors.text },
            destructive && styles.destructive,
          ]}
        >
          {label}
        </Text>
      </View>
      {!destructive ? (
        <ChevronRight size={18} color={colors.textSecondary} strokeWidth={2} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.85,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  label: {
    ...Typography.body,
  },
  destructive: {
    fontFamily: Typography.button.fontFamily,
  },
});
