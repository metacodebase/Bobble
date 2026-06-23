import { ChevronLeft, ChevronRight, Settings } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

type CalendarGridProps = {
  monthLabel: string;
  selectedDay: number;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onSelectDay?: (day: number) => void;
  onSettingsPress?: () => void;
};

function buildMay2024Grid() {
  const days: (number | null)[] = [];
  for (let i = 0; i < 3; i += 1) days.push(null);
  for (let d = 1; d <= 31; d += 1) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

const GRID_DAYS = buildMay2024Grid();
const DAY_SIZE = 36;

export function CalendarGrid({
  monthLabel,
  selectedDay,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
  onSettingsPress,
}: CalendarGridProps) {
  const colors = useBobbleColors();

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < GRID_DAYS.length; i += 7) {
    weeks.push(GRID_DAYS.slice(i, i + 7));
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={onPrevMonth} hitSlop={12}>
          <ChevronLeft size={22} color={colors.text} strokeWidth={2} />
        </Pressable>
        <Text style={[styles.month, { color: colors.text }]}>{monthLabel}</Text>
        <View style={styles.headerRight}>
          <Pressable onPress={onNextMonth} hitSlop={12} style={styles.navNext}>
            <ChevronRight size={22} color={colors.text} strokeWidth={2} />
          </Pressable>
          {onSettingsPress ? (
            <Pressable onPress={onSettingsPress} hitSlop={12}>
              <Settings size={20} color={colors.textSecondary} strokeWidth={2} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.weekdays}>
        {WEEKDAYS.map((day) => (
          <Text key={day} style={[styles.weekday, { color: colors.textSecondary }]}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => {
              const selected = day === selectedDay;
              return (
                <View key={dayIndex} style={styles.cell}>
                  {day ? (
                    <Pressable
                      onPress={() => onSelectDay?.(day)}
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
                          selected && { color: colors.textOnPrimary, fontFamily: Typography.button.fontFamily },
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navNext: {
    marginRight: 4,
  },
  month: {
    ...Typography.heading,
    fontSize: 22,
    lineHeight: 28,
    flex: 1,
    textAlign: 'center',
  },
  weekdays: {
    flexDirection: 'row',
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    ...Typography.caption,
  },
  grid: {
    gap: 4,
  },
  weekRow: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
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
});
