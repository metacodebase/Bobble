import { router } from 'expo-router';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaptureHeader } from '@/src/components/capture/capture-header';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { Typography } from '@/src/theme/fonts';
import { androidSafeBottom, androidSafeTop } from '@/src/utils/safe-padding';

type SettingsScreenLayoutProps = {
  title: string;
  children: ReactNode;
};

export function SettingsScreenLayout({ title, children }: SettingsScreenLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: androidSafeTop(insets.top) + 8,
          paddingBottom: androidSafeBottom(insets.bottom) + 24,
        },
      ]}
    >
      <View style={styles.headerBlock}>
        <CaptureHeader title={title} onBack={() => router.back()} centered safeTop={false} />
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

/** Intro / helper copy that sits on the app backdrop (white in night mode). */
export function SettingsDescription({ children }: { children: ReactNode }) {
  const colors = useBobbleColors();
  const night = useNightForeground();

  return (
    <View style={{ backgroundColor: night.isNight ? '#rgba(0,0,0,0.05)' : '#rgba(0,0,0,0.05)' ,padding: 16, borderRadius: 16}}>
      <Text style={[styles.description, { color: night.isNight ? 'white' : 'grey' }]}>
        {children}
      </Text>
    </View>
  );
}

type SettingsSectionProps = {
  title?: string;
  children: ReactNode;
};

export function SettingsSection({ title, children }: SettingsSectionProps) {
  const colors = useBobbleColors();
  const night = useNightForeground();

  return (
    <View style={styles.section}>
      {title ? (
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </Text>
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
  description: {
    ...Typography.body,
    lineHeight: 22,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    ...Typography.formLabel,

    textTransform: 'uppercase',
    marginLeft: 4,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});
