import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;
const DAY_SIZE = 40;

type DatePickerModalProps = {
  visible: boolean;
  value?: Date | null;
  /** Earliest selectable year (inclusive). Defaults to 1920. */
  minYear?: number;
  /** Latest selectable year (inclusive). Defaults to the current year. */
  maxYear?: number;
  onSelect: (date: Date) => void;
  onClose: () => void;
};

function buildMonthGrid(year: number, month: number): (number | null)[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function isSameDay(a: Date, year: number, month: number, day: number) {
  return a.getFullYear() === year && a.getMonth() === month && a.getDate() === day;
}

export function DatePickerModal({
  visible,
  value,
  minYear = 1920,
  maxYear = new Date().getFullYear(),
  onSelect,
  onClose,
}: DatePickerModalProps) {
  const colors = useBobbleColors();
  const insets = useSafeAreaInsets();

  const initial = value ?? new Date(2000, 0, 1);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [yearMode, setYearMode] = useState(false);

  useEffect(() => {
    if (visible) {
      const base = value ?? new Date(2000, 0, 1);
      setViewYear(base.getFullYear());
      setViewMonth(base.getMonth());
      setYearMode(false);
    }
  }, [visible, value]);

  const weeks = useMemo(() => {
    const cells = buildMonthGrid(viewYear, viewMonth);
    const rows: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [viewYear, viewMonth]);

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = maxYear; y >= minYear; y -= 1) list.push(y);
    return list;
  }, [minYear, maxYear]);

  const goPrevMonth = () => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => Math.max(minYear, y - 1));
        return 11;
      }
      return m - 1;
    });
  };

  const goNextMonth = () => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => Math.min(maxYear, y + 1));
        return 0;
      }
      return m + 1;
    });
  };

  const handleSelectDay = (day: number) => {
    onSelect(new Date(viewYear, viewMonth, day));
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />

        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={styles.header}>
            <Pressable onPress={goPrevMonth} hitSlop={12} disabled={yearMode}>
              <ChevronLeft
                size={24}
                color={yearMode ? colors.border : colors.text}
                strokeWidth={2}
              />
            </Pressable>

            <Pressable onPress={() => setYearMode((v) => !v)} hitSlop={8}>
              <Text style={[styles.monthLabel, { color: colors.text }]}>
                {MONTHS[viewMonth]} {viewYear}
              </Text>
            </Pressable>

            <Pressable onPress={goNextMonth} hitSlop={12} disabled={yearMode}>
              <ChevronRight
                size={24}
                color={yearMode ? colors.border : colors.text}
                strokeWidth={2}
              />
            </Pressable>
          </View>

          {yearMode ? (
            <ScrollView
              style={styles.yearScroll}
              contentContainerStyle={styles.yearGrid}
              showsVerticalScrollIndicator={false}
            >
              {years.map((year) => {
                const selected = year === viewYear;
                return (
                  <Pressable
                    key={year}
                    onPress={() => {
                      setViewYear(year);
                      setYearMode(false);
                    }}
                    style={[
                      styles.yearCell,
                      { backgroundColor: selected ? colors.primary : colors.borderLight },
                    ]}
                  >
                    <Text
                      style={[
                        styles.yearText,
                        { color: selected ? colors.textOnPrimary : colors.text },
                      ]}
                    >
                      {year}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <>
              <View style={styles.weekdays}>
                {WEEKDAYS.map((day) => (
                  <Text
                    key={day}
                    style={[styles.weekday, { color: colors.textSecondary }]}
                  >
                    {day}
                  </Text>
                ))}
              </View>

              <View style={styles.grid}>
                {weeks.map((week, weekIndex) => (
                  <View key={weekIndex} style={styles.weekRow}>
                    {week.map((day, dayIndex) => {
                      const selected =
                        day != null &&
                        value != null &&
                        isSameDay(value, viewYear, viewMonth, day);
                      return (
                        <View key={dayIndex} style={styles.cell}>
                          {day ? (
                            <Pressable
                              onPress={() => handleSelectDay(day)}
                              style={[
                                styles.dayWrap,
                                selected && { backgroundColor: colors.primary },
                              ]}
                              android_ripple={{
                                color: colors.primary + '33',
                                borderless: true,
                                radius: DAY_SIZE / 2,
                              }}
                            >
                              <Text
                                style={[
                                  styles.day,
                                  { color: colors.text },
                                  selected && {
                                    color: colors.textOnPrimary,
                                    fontFamily: Typography.button.fontFamily,
                                  },
                                ]}
                              >
                                {day}
                              </Text>
                            </Pressable>
                          ) : (
                            <View style={styles.daySpacer} />
                          )}
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  monthLabel: {
    ...Typography.heading,
    fontSize: 20,
    lineHeight: 26,
  },
  weekdays: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    ...Typography.caption,
  },
  grid: {
    gap: 2,
  },
  weekRow: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
  },
  dayWrap: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: DAY_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySpacer: {
    width: DAY_SIZE,
    height: DAY_SIZE,
  },
  day: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: DAY_SIZE,
    textAlign: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  yearScroll: {
    maxHeight: 320,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    paddingBottom: 8,
  },
  yearCell: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  yearText: {
    ...Typography.body,
    fontSize: 16,
  },
});
