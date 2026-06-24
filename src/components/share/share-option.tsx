import { Link2, MoreHorizontal } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  FacebookIcon,
  SlackIcon,
  WhatsAppIcon,
  XIcon,
} from '@/src/components/onboarding/social-icons';
import { SHARE_OPTIONS } from '@/src/data/demo-data';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type ShareOptionId = (typeof SHARE_OPTIONS)[number]['id'];

type ShareOptionProps = {
  id: ShareOptionId;
  label: string;
  onPress?: () => void;
};

const ICON_SIZE = 28;

function ShareOptionIcon({ id }: { id: ShareOptionId }) {
  const colors = useBobbleColors();

  switch (id) {
    case 'copy':
      return <Link2 size={ICON_SIZE} color={colors.primary} strokeWidth={2} />;
    case 'whatsapp':
      return <WhatsAppIcon size={ICON_SIZE} />;
    case 'twitter':
      return <XIcon size={ICON_SIZE} color={colors.text} />;
    case 'facebook':
      return <FacebookIcon size={ICON_SIZE} />;
    case 'slack':
      return <SlackIcon size={ICON_SIZE} />;
    case 'more':
      return <MoreHorizontal size={ICON_SIZE} color={colors.textSecondary} strokeWidth={2} />;
  }
}

export function ShareOption({ id, label, onPress }: ShareOptionProps) {
  const colors = useBobbleColors();
  const usesMutedBackground = id === 'copy' || id === 'more';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.root, pressed && styles.pressed]}>
      <View
        style={[
          styles.icon,
          usesMutedBackground && { backgroundColor: colors.borderLight },
        ]}
      >
        <ShareOptionIcon id={id} />
      </View>
      <Text style={[styles.label, { color: colors.text }]} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '30%',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.caption,
    textAlign: 'center',
  },
});
