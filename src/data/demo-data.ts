export type BobbleCategory = 'ideas' | 'personal' | 'work' | 'health';

export type BobbleItem = {
  id: string;
  title: string;
  timestamp: string;
  category: BobbleCategory;
  durationMin: number;
  dateLabel: string;
};

export const BOBBLE_FILTERS = ['All', 'Ideas', 'Personal', 'Work', 'Health'] as const;
export type BobbleFilter = (typeof BOBBLE_FILTERS)[number];

export const DEMO_BOBBLES: BobbleItem[] = [
  {
    id: '1',
    title: 'Gym routine & nutrition plan',
    timestamp: 'Today, 11:37 AM',
    category: 'health',
    durationMin: 5,
    dateLabel: 'Today, 11:30 AM',
  },
  {
    id: '2',
    title: 'Q3 product roadmap ideas',
    timestamp: 'Yesterday, 4:15 PM',
    category: 'work',
    durationMin: 8,
    dateLabel: 'Yesterday, 4:15 PM',
  },
  {
    id: '3',
    title: 'Weekend trip planning',
    timestamp: 'Mon, 9:00 AM',
    category: 'personal',
    durationMin: 4,
    dateLabel: 'Mon, 9:00 AM',
  },
  {
    id: '4',
    title: 'App feature brainstorm',
    timestamp: 'Sun, 2:30 PM',
    category: 'ideas',
    durationMin: 6,
    dateLabel: 'Sun, 2:30 PM',
  },
];

export const DEMO_BOBBLE_DETAIL = {
  title: 'Gym routine & nutrition plan',
  dateLabel: 'Today, 11:30 AM',
  durationMin: 5,
  bullets: [
    { label: 'Goal', value: 'Build muscle & improve stamina' },
    { label: 'Workout', value: '5 days a week (Focus on strength)' },
    { label: 'Nutrition', value: 'High protein, balanced meals' },
    { label: 'Reminder', value: 'Add reminders for workouts' },
  ],
  transcript:
    "I want to build muscle and improve my stamina. I'm planning to work out five days a week with a focus on strength training. For nutrition, I'll stick to high protein and balanced meals. Also, please add reminders for my workouts.",
} as const;

export const TASK_FILTERS = ['All', 'Today', 'Upcoming', 'Done'] as const;
export type TaskFilter = (typeof TASK_FILTERS)[number];

export type TaskItem = {
  id: string;
  title: string;
  time: string;
  done: boolean;
  group: 'today' | 'tomorrow' | 'upcoming';
};

export const DEMO_TASKS: TaskItem[] = [
  { id: '1', title: 'Leg day workout', time: '10:00 AM', done: false, group: 'today' },
  { id: '2', title: 'Meal prep', time: '2:00 PM', done: false, group: 'today' },
  { id: '3', title: 'Review notes', time: '6:00 PM', done: true, group: 'today' },
  { id: '4', title: 'Cardio session', time: '7:00 AM', done: false, group: 'tomorrow' },
  { id: '5', title: 'Team standup prep', time: '9:30 AM', done: false, group: 'tomorrow' },
];

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  day: number;
};

export const DEMO_CALENDAR = {
  monthLabel: 'May 2024',
  selectedDay: 12,
  agendaLabel: 'Today • May 12',
  events: [
    { id: '1', title: 'Leg day workout', start: '10:00 AM', end: '11:00 AM', day: 12 },
    { id: '2', title: 'Meal prep', start: '2:00 PM', end: '3:00 PM', day: 12 },
  ] as CalendarEvent[],
};

export const SHARE_OPTIONS = [
  { id: 'copy', label: 'Copy Link' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'twitter', label: 'X (Twitter)' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'slack', label: 'Slack Social' },
  { id: 'more', label: 'More' },
] as const;

export const PROFILE_MENU = [
  { id: 'account', label: 'Account', icon: 'user' },
  { id: 'calendar', label: 'Calendar Sync', icon: 'calendar' },
  { id: 'connections', label: 'Connections', icon: 'link' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'appearance', label: 'Appearance', icon: 'palette' },
  { id: 'language', label: 'Language', icon: 'globe' },
  { id: 'help', label: 'Help & Support', icon: 'help' },
  { id: 'about', label: 'About Bobble', icon: 'info' },
] as const;

export const GAMIFICATION = {
  level: 12,
  title: 'Mind Explorer',
  currentXp: 2450,
  maxXp: 3000,
  stats: {
    bobbles: 48,
    tasksDone: 32,
    streakDays: 7,
  },
  badges: ['Early Bird', 'Consistent', 'Mind Tamer'],
} as const;

export const PROFILE_USER = {
  name: 'Steven',
  email: 'steven@example.com',
} as const;

export function getBobbleById(id: string): BobbleItem | undefined {
  return DEMO_BOBBLES.find((b) => b.id === id);
}

export function filterBobbles(filter: BobbleFilter, query: string): BobbleItem[] {
  const normalized = query.trim().toLowerCase();
  return DEMO_BOBBLES.filter((bobble) => {
    const matchesFilter =
      filter === 'All' ||
      bobble.category === filter.toLowerCase();
    const matchesQuery =
      !normalized || bobble.title.toLowerCase().includes(normalized);
    return matchesFilter && matchesQuery;
  });
}

export function filterTasks(filter: TaskFilter): { label: string; tasks: TaskItem[] }[] {
  const groups: { label: string; key: TaskItem['group'] }[] = [
    { label: 'Today', key: 'today' },
    { label: 'Tomorrow', key: 'tomorrow' },
  ];

  return groups
    .map(({ label, key }) => {
      let tasks = DEMO_TASKS.filter((t) => t.group === key);
      if (filter === 'Today') tasks = tasks.filter((t) => t.group === 'today');
      if (filter === 'Upcoming') tasks = tasks.filter((t) => t.group !== 'today');
      if (filter === 'Done') tasks = tasks.filter((t) => t.done);
      return { label, tasks };
    })
    .filter((section) => section.tasks.length > 0);
}
