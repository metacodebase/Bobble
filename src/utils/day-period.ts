export type DayPeriod = 'morning' | 'afternoon' | 'evening';

/**
 * Time-of-day windows for home greeting, large Bobble, and night mode:
 * - Morning: 12:00 AM – 12:00 PM
 * - Afternoon: 12:00 PM – 5:00 PM
 * - Evening: 5:00 PM – 11:59 PM
 */
export function getDayPeriod(date = new Date()): DayPeriod {
  const hour = date.getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export function getGreeting(date = new Date()) {
  switch (getDayPeriod(date)) {
    case 'morning':
      return 'Good morning';
    case 'afternoon':
      return 'Good afternoon';
    case 'evening':
      return 'Good evening';
  }
}
