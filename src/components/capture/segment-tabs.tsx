import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export type SummaryTab = 'summary' | 'transcript' | 'mindmap' | 'insights';

type SegmentTabsProps = {
  active: SummaryTab;
  onChange: (tab: SummaryTab) => void;
  /** Tighter spacing when content (e.g. Mind Score) sits directly below */
  compact?: boolean;
};

const TABS: { id: SummaryTab; label: string }[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'transcript', label: 'Transcript' },
  { id: 'mindmap', label: 'Mind Map' },
  { id: 'insights', label: 'Insights' },
];

export function SegmentTabs({ active, onChange, compact = false }: SegmentTabsProps) {
  const colors = useBobbleColors();

  return (
    <View
      style={[
        styles.root,
        compact ? styles.rootCompact : null,
        { borderBottomColor: colors.border },
      ]}
    >
      {TABS.map((tab) => {
        const selected = tab.id === active;
        return (
          <Pressable key={tab.id} onPress={() => onChange(tab.id)} style={styles.tab}>
            <Text
              style={[
                styles.label,
                selected && styles.labelSelected,
                selected && { color: colors.primary },
              ]}
            >
              {tab.label}
            </Text>
            {selected ? <View style={[styles.indicator, { backgroundColor: colors.primary }]} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  rootCompact: {
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 12,
    gap: 8,
  },
  label: {
    ...Typography.caption,
    fontFamily: Typography.button.fontFamily,
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
  },
  labelSelected: {
    fontFamily: Typography.button.fontFamily,
    fontSize: 15,
    lineHeight: 20,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '70%',
    borderRadius: 1,
  },
});
