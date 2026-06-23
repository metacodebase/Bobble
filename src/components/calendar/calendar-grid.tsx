import { ChevronLeft, ChevronRight, Settings } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { BobbleColors } from '@/src/theme/colors';
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
  // May 2024 starts on Wednesday (index 3), 31 days
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
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < GRID_DAYS.length; i += 7) {
    weeks.push(GRID_DAYS.slice(i, i + 7));
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable onPress={onPrevMonth} hitSlop={12}>
          <ChevronLeft size={22} color={BobbleColors.text} strokeWidth={2} />
        </Pressable>
        <Text style={styles.month}>{monthLabel}</Text>
        <View style={styles.headerRight}>
          <Pressable onPress={onNextMonth} hitSlop={12} style={styles.navNext}>
            <ChevronRight size={22} color={BobbleColors.text} strokeWidth={2} />
          </Pressable>
          {onSettingsPress ? (
            <Pressable onPress={onSettingsPress} hitSlop={12}>
              <Settings size={20} color={BobbleColors.textSecondary} strokeWidth={2} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.weekdays}>
        {WEEKDAYS.map((day) => (
          <Text key={day} style={styles.weekday}>
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
                      style={[styles.dayWrap, selected && styles.daySelected]}
                      android_ripple={{
                        color: BobbleColors.primary + '33',
                        borderless: true,
                        radius: DAY_SIZE / 2,
                      }}
                    >
                      <Text style={[styles.day, selected && styles.dayTextSelected]}>{day}</Text>
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
    color: BobbleColors.text,
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
    color: BobbleColors.textSecondary,
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
  daySelected: {
    backgroundColor: BobbleColors.primary,
  },
  day: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: DAY_SIZE,
    textAlign: 'center',
    color: BobbleColors.text,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
  dayTextSelected: {
    color: BobbleColors.textOnPrimary,
    fontFamily: Typography.button.fontFamily,
  },
});
