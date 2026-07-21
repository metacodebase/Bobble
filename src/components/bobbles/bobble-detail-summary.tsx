import { StyleSheet, Text, View } from 'react-native';

import { BobbleSummaryCards } from '@/src/components/bobbles/bobble-summary-cards';
import { PinnedBadge } from '@/src/components/bobbles/pinned-badge';
import { DEMO_BOBBLE_DETAIL } from '@/src/data/demo-data';
import { Typography } from '@/src/theme/fonts';

const SUMMARY_TEXT = '#17164B';

type BobbleDetailSummaryProps = {
  title?: string;
  dateLabel?: string;
  durationMin?: number;
  bullets?: readonly { label: string; value: string }[];
  pinned?: boolean;
};

export function BobbleDetailSummary({
  title = DEMO_BOBBLE_DETAIL.title,
  dateLabel = DEMO_BOBBLE_DETAIL.dateLabel,
  durationMin = DEMO_BOBBLE_DETAIL.durationMin,
  bullets = DEMO_BOBBLE_DETAIL.bullets,
  pinned = false,
}: BobbleDetailSummaryProps) {
  return (
    <View style={styles.section}>
      {pinned ? <PinnedBadge size={28} style={styles.pinBadge} /> : null}
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.metaBadge}>
          <Text style={styles.metaText}>
            {dateLabel} · {durationMin} min
          </Text>
        </View>
      </View>

      <BobbleSummaryCards items={bullets} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 20,
    position: 'relative',
  },
  pinBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    ...Typography.heading,
    flex: 1,
    fontSize: 22,
    lineHeight: 28,
    color: SUMMARY_TEXT,
  },
  metaBadge: {
    backgroundColor: 'rgba(107, 114, 128, 0.12)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 2,
  },
  metaText: {
    ...Typography.caption,
    fontSize: 11,
    lineHeight: 14,
    color: '#000000',
  },
});
