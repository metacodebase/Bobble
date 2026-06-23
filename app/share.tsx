import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ShareOption } from '@/src/components/share/share-option';
import { DEMO_BOBBLE_DETAIL, SHARE_OPTIONS } from '@/src/data/demo-data';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';

export default function ShareScreen() {
  const insets = useSafeAreaInsets();
  const { title } = useLocalSearchParams<{ title?: string }>();
  const [linkPublic, setLinkPublic] = useState(true);
  const bobbleTitle = title ?? DEMO_BOBBLE_DETAIL.title;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Share Bobble</Text>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <X size={24} color={BobbleColors.text} strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.preview}>
          <Text style={styles.previewTitle}>{bobbleTitle}</Text>
          <Text style={styles.previewBody} numberOfLines={3}>
            {DEMO_BOBBLE_DETAIL.bullets.map((b) => `${b.label}: ${b.value}`).join(' · ')}
          </Text>
        </View>

        <View style={styles.grid}>
          {SHARE_OPTIONS.map((option) => (
            <ShareOption
              key={option.id}
              label={option.label}
              onPress={() => {}}
            />
          ))}
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Anyone with the link can view</Text>
          <Switch
            value={linkPublic}
            onValueChange={setLinkPublic}
            trackColor={{ false: BobbleColors.border, true: BobbleColors.primaryMuted }}
            thumbColor={linkPublic ? BobbleColors.primary : BobbleColors.background}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BobbleColors.background,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    ...Typography.heading,
    fontSize: 24,
    lineHeight: 32,
    color: BobbleColors.text,
  },
  content: {
    paddingBottom: 24,
  },
  preview: {
    backgroundColor: BobbleColors.borderLight,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    marginBottom: 28,
  },
  previewTitle: {
    ...Typography.body,
    fontFamily: Typography.button.fontFamily,
    color: BobbleColors.text,
  },
  previewBody: {
    ...Typography.caption,
    color: BobbleColors.textSecondary,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BobbleColors.border,
  },
  toggleLabel: {
    ...Typography.body,
    color: BobbleColors.text,
    flex: 1,
    marginRight: 12,
  },
});
