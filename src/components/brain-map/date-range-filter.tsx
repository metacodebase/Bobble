import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { Typography } from '@/src/theme/fonts';

export type MindMapDateFilter = 'week' | 'month' | 'all' | 'custom';
export type CustomDateRange = { start: Date; end: Date } | null;

type Props = {
  value: MindMapDateFilter;
  customRange: CustomDateRange;
  onChange: (filter: MindMapDateFilter, range?: CustomDateRange) => void;
};

const WEEK_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function monthDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const leading = new Date(year, monthIndex, 1).getDay();
  const count = new Date(year, monthIndex + 1, 0).getDate();
  return [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: count }, (_, index) => new Date(year, monthIndex, index + 1)),
  ];
}

export function DateRangeFilter({ value, customRange, onChange }: Props) {
  const colors = useBobbleColors();
  const night = useNightForeground();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const date = customRange?.start ?? new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const [draftStart, setDraftStart] = useState<Date | null>(customRange?.start ?? null);
  const [draftEnd, setDraftEnd] = useState<Date | null>(customRange?.end ?? null);
  const days = useMemo(() => monthDays(visibleMonth), [visibleMonth]);
  const foreground = night.text ?? colors.text;
  const secondary = night.textSecondary ?? colors.textSecondary;

  const openCalendar = () => {
    setDraftStart(customRange?.start ?? null);
    setDraftEnd(customRange?.end ?? null);
    setCalendarOpen(true);
  };

  const selectDate = (date: Date) => {
    const selected = startOfDay(date);
    if (!draftStart || draftEnd) {
      setDraftStart(selected);
      setDraftEnd(null);
    } else if (selected < draftStart) {
      setDraftStart(selected);
    } else {
      setDraftEnd(selected);
    }
  };

  const applyRange = () => {
    if (!draftStart) return;
    onChange('custom', { start: draftStart, end: draftEnd ?? draftStart });
    setCalendarOpen(false);
  };

  return (
    <>
      <View style={styles.row} accessibilityRole="toolbar">
        {(['week', 'month', 'all'] as const).map((filter) => {
          const selected = value === filter;
          return (
            <Pressable
              key={filter}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(filter)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: selected ? colors.primary : colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.chipText, { color: selected ? '#FFFFFF' : foreground }]}>
                {filter[0].toUpperCase() + filter.slice(1)}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Choose a custom date range"
          accessibilityState={{ selected: value === 'custom' }}
          onPress={openCalendar}
          style={({ pressed }) => [
            styles.calendarChip,
            {
              backgroundColor: value === 'custom' ? colors.primary : colors.surface,
              borderColor: value === 'custom' ? colors.primary : colors.border,
            },
            pressed && styles.pressed,
          ]}
        >
          <CalendarDays size={17} color={value === 'custom' ? '#FFFFFF' : colors.primary} />
          {value === 'custom' && customRange ? (
            <Text style={[styles.rangeLabel, { color: '#FFFFFF' }]} numberOfLines={1}>
              {formatShortDate(customRange.start)}–{formatShortDate(customRange.end)}
            </Text>
          ) : null}
        </Pressable>
      </View>

      <Modal
        visible={calendarOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarOpen(false)}
      >
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setCalendarOpen(false)} />
          <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={[styles.sheetTitle, { color: foreground }]}>Choose dates</Text>
                <Text style={[styles.sheetHint, { color: secondary }]}>
                  Select a start and end date
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close calendar"
                hitSlop={8}
                onPress={() => setCalendarOpen(false)}
                style={styles.iconButton}
              >
                <X size={20} color={secondary} />
              </Pressable>
            </View>

            <View style={styles.monthHeader}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Previous month"
                onPress={() =>
                  setVisibleMonth(
                    new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1)
                  )
                }
                style={styles.iconButton}
              >
                <ChevronLeft size={22} color={foreground} />
              </Pressable>
              <Text style={[styles.monthTitle, { color: foreground }]}>
                {visibleMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Next month"
                onPress={() =>
                  setVisibleMonth(
                    new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1)
                  )
                }
                style={styles.iconButton}
              >
                <ChevronRight size={22} color={foreground} />
              </Pressable>
            </View>

            <View style={styles.calendarGrid}>
              {WEEK_DAYS.map((day, index) => (
                <View key={`${day}-${index}`} style={styles.dayCell}>
                  <Text style={[styles.weekDay, { color: secondary }]}>{day}</Text>
                </View>
              ))}
              {days.map((date, index) => {
                if (!date) return <View key={`blank-${index}`} style={styles.dayCell} />;
                const isStart = !!draftStart && sameDay(date, draftStart);
                const isEnd = !!draftEnd && sameDay(date, draftEnd);
                const inRange = !!draftStart && !!draftEnd && date > draftStart && date < draftEnd;
                const selected = isStart || isEnd;
                return (
                  <Pressable
                    key={date.toISOString()}
                    accessibilityRole="button"
                    accessibilityLabel={date.toLocaleDateString()}
                    accessibilityState={{ selected: selected || inRange }}
                    onPress={() => selectDate(date)}
                    style={[
                      styles.dayCell,
                      inRange && { backgroundColor: `${colors.primary}20` },
                      selected && { backgroundColor: colors.primary, borderRadius: 18 },
                    ]}
                  >
                    <Text style={[styles.dayText, { color: selected ? '#FFFFFF' : foreground }]}>
                      {date.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.selectionSummary}>
              <Text style={[styles.selectionText, { color: secondary }]}>
                {draftStart
                  ? `${formatShortDate(draftStart)} – ${formatShortDate(draftEnd ?? draftStart)}`
                  : 'No dates selected'}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Apply custom date range"
                disabled={!draftStart}
                onPress={applyRange}
                style={({ pressed }) => [
                  styles.applyButton,
                  { backgroundColor: colors.primary },
                  !draftStart && styles.disabled,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.applyText}>Show bobbles</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    minHeight: 38,
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 19,
    paddingHorizontal: 14,
  },
  chipText: {
    ...Typography.button,
    fontSize: 13,
    lineHeight: 17,
  },
  calendarChip: {
    minWidth: 38,
    minHeight: 38,
    maxWidth: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 19,
    paddingHorizontal: 10,
  },
  rangeLabel: {
    ...Typography.button,
    flexShrink: 1,
    fontSize: 11,
    lineHeight: 15,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(25, 14, 39, 0.48)',
  },
  sheet: {
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    ...Typography.heading,
    fontSize: 20,
    lineHeight: 26,
  },
  sheetHint: {
    ...Typography.body,
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 8,
  },
  monthTitle: {
    ...Typography.heading,
    fontSize: 16,
    lineHeight: 22,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.285714%',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDay: {
    ...Typography.button,
    fontSize: 11,
  },
  dayText: {
    ...Typography.body,
    fontSize: 13,
    lineHeight: 18,
  },
  selectionSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  selectionText: {
    ...Typography.body,
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  applyButton: {
    minHeight: 42,
    justifyContent: 'center',
    borderRadius: 21,
    paddingHorizontal: 18,
  },
  applyText: {
    ...Typography.button,
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 17,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.72,
  },
});
