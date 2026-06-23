import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AgendaEvent } from '@/src/components/calendar/agenda-event';
import { CalendarGrid } from '@/src/components/calendar/calendar-grid';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { DEMO_CALENDAR } from '@/src/data/demo-data';
import { useTabBarInsets } from '@/src/hooks/use-tab-bar-insets';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { Typography } from '@/src/theme/fonts';

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const colors = useBobbleColors();
  const { height: tabBarHeight } = useTabBarInsets();
  const [selectedDay, setSelectedDay] = useState(DEMO_CALENDAR.selectedDay);
  const dayEvents = DEMO_CALENDAR.events.filter((event) => event.day === selectedDay);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: tabBarHeight + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <CalendarGrid
          monthLabel={DEMO_CALENDAR.monthLabel}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />

        <Text style={[styles.agendaLabel, { color: colors.text }]}>Today • May {selectedDay}</Text>

        {dayEvents.map((event) => (
          <AgendaEvent key={event.id} title={event.title} start={event.start} end={event.end} />
        ))}

        {dayEvents.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textSecondary }]}>No events scheduled.</Text>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: tabBarHeight, backgroundColor: colors.background }]}>
        <PrimaryButton style={{width:'100%',alignSelf:'center'}} label="+ Add Event" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scroll: {
    paddingTop: 4,
  },
  agendaLabel: {
    ...Typography.formLabel,
    fontSize: 15,
    marginTop: 24,
    marginBottom: 12,
  },
  empty: {
    ...Typography.body,
  },
  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 0,
    paddingTop: 12,
    width: '100%',
    alignSelf:'center',
  },
});
