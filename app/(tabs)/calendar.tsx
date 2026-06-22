import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AgendaEvent } from '@/src/components/calendar/agenda-event';
import { CalendarGrid } from '@/src/components/calendar/calendar-grid';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { DEMO_CALENDAR } from '@/src/data/demo-data';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';
import { toast } from '@/src/utils/toast';

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState(DEMO_CALENDAR.selectedDay);
  const dayEvents = DEMO_CALENDAR.events.filter((event) => event.day === selectedDay);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <CalendarGrid
          monthLabel={DEMO_CALENDAR.monthLabel}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onPrevMonth={() => toast.info('Previous month coming soon')}
          onNextMonth={() => toast.info('Next month coming soon')}
          onSettingsPress={() => toast.info('Calendar settings coming soon')}
        />

        <Text style={styles.agendaLabel}>Today • May {selectedDay}</Text>

        {dayEvents.map((event) => (
          <AgendaEvent key={event.id} title={event.title} start={event.start} end={event.end} />
        ))}

        {dayEvents.length === 0 ? (
          <Text style={styles.empty}>No events scheduled.</Text>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 88 }]}>
        <PrimaryButton label="+ Add Event" onPress={() => toast.info('Add event coming soon')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BobbleColors.background,
    paddingHorizontal: 24,
  },
  scroll: {
    paddingTop: 4,
  },
  agendaLabel: {
    ...Typography.formLabel,
    fontSize: 15,
    color: BobbleColors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  empty: {
    ...Typography.body,
    color: BobbleColors.textSecondary,
  },
  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 0,
    paddingTop: 12,
    backgroundColor: BobbleColors.background,
  },
});
