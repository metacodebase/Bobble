import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaptureHeader } from '@/src/components/capture/capture-header';
import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import type { LegalSection } from '@/src/data/legal-types';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type LegalDocumentScreenProps = {
  title: string;
  effectiveDate: string;
  version: string;
  operator: string;
  contactLine?: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalDocumentScreen({
  title,
  effectiveDate,
  version,
  operator,
  contactLine,
  intro,
  sections,
}: LegalDocumentScreenProps) {
  const colors = useBobbleColors();
  const insets = useSafeAreaInsets();

  return (
    <OnboardingScreenLayout contentStyle={styles.content}>
      <View style={[styles.header, { paddingTop: insets.top > 0 ? 0 : 8 }]}>
        <CaptureHeader title={title} onBack={() => router.back()} centered />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          Effective Date: {effectiveDate}
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>Version: {version}</Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>{operator}</Text>
        {contactLine ? (
          <Text style={[styles.meta, { color: colors.textSecondary }]}>{contactLine}</Text>
        ) : null}

        <Text style={[styles.intro, { color: colors.text }]}>{intro}</Text>

        {sections.map((section) => (
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
  meta: {
    ...Typography.caption,
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
