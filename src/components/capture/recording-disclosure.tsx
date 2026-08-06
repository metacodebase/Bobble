import { ShieldCheck } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { BobbleColors, FontFamily } from '@/src/theme';

type RecordingDisclosureProps = {
  visible: boolean;
  continuing: boolean;
  onContinue: () => void;
  onNotNow: () => void;
  onPrivacyPolicy: () => void;
};

export function RecordingDisclosure({
  visible,
  continuing,
  onContinue,
  onNotNow,
  onPrivacyPolicy,
}: RecordingDisclosureProps) {
  const colors = useBobbleColors();

  return (
    <Modal
      animationType="fade"
      onRequestClose={onNotNow}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.backdrop}>
        <View
          accessibilityRole="alert"
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={[styles.iconBubble, { backgroundColor: `${colors.primary}18` }]}>
            <ShieldCheck color={colors.primary} size={36} strokeWidth={2.2} />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            How your recording is processed
          </Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            Your voice recording is sent to AssemblyAI for transcription. Your transcript and
            related content are sent to OpenAI to provide the AI features you request.
          </Text>

          <Pressable
            accessibilityRole="link"
            onPress={onPrivacyPolicy}
            style={({ pressed }) => [styles.privacyLink, pressed && styles.pressed]}
          >
            <Text style={[styles.privacyLabel, { color: colors.textAccent }]}>Privacy Policy</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={continuing}
            onPress={onContinue}
            style={({ pressed }) => [
              styles.continueButton,
              continuing && styles.disabled,
              pressed && !continuing && styles.continuePressed,
            ]}
          >
            <Text style={styles.continueLabel}>{continuing ? 'Getting ready...' : 'Continue'}</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={continuing}
            onPress={onNotNow}
            style={({ pressed }) => [styles.notNowButton, pressed && styles.pressed]}
          >
            <Text style={[styles.notNowLabel, { color: colors.textSecondary }]}>Not now</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(28, 15, 52, 0.55)',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 14,
    alignItems: 'center',
    shadowColor: '#24103F',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  iconBubble: {
    width: 72,
    height: 72,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 21,
    lineHeight: 29,
    textAlign: 'center',
  },
  message: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 10,
  },
  privacyLink: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginVertical: 5,
  },
  privacyLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    lineHeight: 21,
    textDecorationLine: 'underline',
  },
  continueButton: {
    width: '100%',
    minHeight: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: BobbleColors.primary,
  },
  continuePressed: {
    opacity: 0.88,
    backgroundColor: BobbleColors.primaryDark,
  },
  continueLabel: {
    fontFamily: FontFamily.bold,
    color: BobbleColors.textOnPrimary,
    fontSize: 16,
    lineHeight: 22,
  },
  notNowButton: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  notNowLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    lineHeight: 21,
  },
  pressed: {
    opacity: 0.68,
  },
  disabled: {
    opacity: 0.6,
  },
});
