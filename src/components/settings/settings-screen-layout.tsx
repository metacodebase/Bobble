import { router } from 'expo-router';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaptureHeader } from '@/src/components/capture/capture-header';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

type SettingsScreenLayoutProps = {
  title: string;
  children: ReactNode;
};

export function SettingsScreenLayout({ title, children }: SettingsScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const colors = useBobbleColors();

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.background, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View style={styles.headerBlock}>
        <CaptureHeader title={title} onBack={() => router.back()} centered />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {children}
      </ScrollView>
    </View>
  );
}

type SettingsSectionProps = {
  title?: string;
  children: ReactNode;
};

export function SettingsSection({ title, children }: SettingsSectionProps) {
  const colors = useBobbleColors();

  return (
    <View style={styles.section}>
      {title ? (
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
      ) : null}
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerBlock: {
    marginBottom: 8,
  },
  content: {
    paddingBottom: 24,
    gap: 24,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginLeft: 4,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});
