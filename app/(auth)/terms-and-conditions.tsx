import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaptureHeader } from '@/src/components/capture/capture-header';
import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { TERMS_AND_CONDITIONS, TERMS_LAST_UPDATED } from '@/src/data/terms-and-conditions';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export default function TermsAndConditionsScreen() {
  const colors = useBobbleColors();
  const insets = useSafeAreaInsets();

  return (
    <OnboardingScreenLayout contentStyle={styles.content}>
      <View style={[styles.header, { paddingTop: insets.top > 0 ? 0 : 8 }]}>
        <CaptureHeader title="Terms & Conditions" onBack={() => router.back()} centered />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.updated, { color: colors.textSecondary }]}>
          Last updated: {TERMS_LAST_UPDATED}
        </Text>

        <Text style={[styles.intro, { color: colors.text }]}>
          Please read these Terms and Conditions carefully before using Bobble. These are placeholder
          terms for demo purposes and will be replaced with final legal text.
        </Text>

        {TERMS_AND_CONDITIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    alignSelf: 'stretch',
  },
  header: {
    width: '100%',
    paddingHorizontal: 16,
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 20,
  },
  updated: {
    ...Typography.caption,
    marginTop: 8,
  },
  intro: {
    ...Typography.body,
    lineHeight: 22,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    ...Typography.formLabel,
    fontSize: 16,
    lineHeight: 22,
  },
  sectionBody: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
});
