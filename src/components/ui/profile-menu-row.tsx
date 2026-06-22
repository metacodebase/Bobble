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

import { BobbleColors } from '@/src/theme/colors';
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
  const Icon = ICONS[icon] ?? User;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.left}>
        <Icon
          size={20}
          color={destructive ? BobbleColors.error : BobbleColors.textSecondary}
          strokeWidth={2}
        />
        <Text style={[styles.label, destructive && styles.destructive]}>{label}</Text>
      </View>
      {!destructive ? (
        <ChevronRight size={18} color={BobbleColors.textSecondary} strokeWidth={2} />
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
    borderBottomColor: BobbleColors.border,
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
    color: BobbleColors.text,
  },
  destructive: {
    color: BobbleColors.error,
    fontFamily: Typography.button.fontFamily,
  },
});
