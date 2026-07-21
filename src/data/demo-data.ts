export type BobbleCategory = import('@/src/features/bobbles/types').BobbleCategory;

export type BobbleIconVariant = import('@/src/features/bobbles/types').BobbleIconVariant;

export type BobbleItem = {
  id: string;
  title: string;
  timestamp: string;
  category: BobbleCategory;
  iconVariant: BobbleIconVariant;
  durationMin: number;
  dateLabel: string;
};

export const BOBBLE_FILTERS = ['All', 'Ideas', 'Tasks', 'Brain Dump', 'Reflections'] as const;
export type BobbleFilter = (typeof BOBBLE_FILTERS)[number];

const FILTER_TO_CATEGORY: Record<Exclude<BobbleFilter, 'All'>, BobbleCategory> = {
  Ideas: 'ideas',
  Tasks: 'tasks',
  'Brain Dump': 'brain-dump',
  Reflections: 'reflections',
};

export const DEMO_BOBBLES: BobbleItem[] = [
  {
    id: '1',
    title: 'Gym routine & nutrition plan',
    timestamp: 'Today, 11:30 AM',
    category: 'tasks',
    iconVariant: 'dumbbell',
    durationMin: 5,
    dateLabel: 'Today, 11:30 AM',
  },
  {
    id: '2',
    title: 'Nutritional Meal Planning',
    timestamp: 'Today, 8:00 AM',
    category: 'tasks',
    iconVariant: 'leaf',
    durationMin: 4,
    dateLabel: 'Today, 8:00 AM',
  },
  {
    id: '3',
    title: 'Gym routine & nutrition plan',
    timestamp: 'Today, 11:30 AM',
    category: 'brain-dump',
    iconVariant: 'bell',
    durationMin: 3,
    dateLabel: 'Today, 11:30 AM',
  },
  {
    id: '4',
    title: 'Weekend Trip Planning',
    timestamp: 'Mon, 10:00 AM',
    category: 'reflections',
    iconVariant: 'luggage',
    durationMin: 4,
    dateLabel: 'Mon, 10:00 AM',
  },
  {
    id: '5',
    title: 'App Feature Brainstorm',
    timestamp: 'Sun, 2:30 PM',
    category: 'ideas',
    iconVariant: 'lightbulb',
    durationMin: 6,
    dateLabel: 'Sun, 2:30 PM',
  },
];

export const DEMO_BOBBLE_DETAIL = {
  title: 'Gym routine & nutrition plan',
  dateLabel: 'Today, 11:30 AM',
  durationMin: 5,
  mindScore: 41,
  mindMapCenter: 'Fitness Plan',
  mindMapBranches: ['Strength', 'Nutrition', 'Reminders'],
  bullets: [
    { label: 'Goal', value: 'Build muscle & improve stamina' },
    { label: 'Workout Plan', value: '5 days a week Focus on strength' },
    { label: 'Nutrition', value: 'High protein, balanced meals' },
    { label: 'Reminder', value: 'Add workout reminders' },
  ],
  transcript:
    "I want to build muscle and improve my stamina. I'm planning to work out five days a week with a focus on strength training. For nutrition, I'll stick to high protein and balanced meals. Also, please add reminders for my workouts.",
  recordingDurationSeconds: 34,
} as const;

export type TranscriptSegment = {
  id: string;
  timestampSeconds: number;
  timestampLabel: string;
  text: string;
};

export type MindMapNodePosition = 'top' | 'left' | 'right' | 'bottom-left' | 'bottom-right';

export type MindMapNode = {
  id: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
  lineColor: string;
  position: MindMapNodePosition;
};

export const DEMO_MIND_MAP = {
  centerTitle: 'Fitness Plan',
  nodes: [
    {
      id: 'goal',
      title: 'Goal',
      subtitle: 'Build muscle & improve stamina',
      backgroundColor: '#EDE9FE',
      lineColor: '#C4B5FD',
      position: 'top',
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      subtitle: 'High protein Balanced Meals',
      backgroundColor: '#DCFCE7',
      lineColor: '#86EFAC',
      position: 'left',
    },
    {
      id: 'workout',
      title: 'Workout',
      subtitle: '5 days/week Strength Focus',
      backgroundColor: '#DBEAFE',
      lineColor: '#93C5FD',
      position: 'right',
    },
    {
      id: 'reminders',
      title: 'Reminders',
      subtitle: 'Workout reminders',
      backgroundColor: '#FEF9C3',
      lineColor: '#FDE047',
      position: 'bottom-left',
    },
    {
      id: 'recovery',
      title: 'Recovery',
      subtitle: 'Active recovery 1-2 days',
      backgroundColor: '#FCE7F3',
      lineColor: '#F9A8D4',
      position: 'bottom-right',
    },
  ] as MindMapNode[],
};

export type InsightIcon = 'smile' | 'chart' | 'star' | 'gauge';

export type InsightItem = {
  id: string;
  icon: InsightIcon;
  text?: string;
  label?: string;
  value?: string;
  subtext?: string;
};

export const DEMO_INSIGHTS = {
  title: "Bobble's insights 💜",
  items: [
    {
      id: 'excited',
      icon: 'smile',
      text: 'You seem excited about achieving your fitness goal!',
    },
    {
      id: 'consistency',
      icon: 'chart',
      text: 'You mentioned consistency 3 times.',
    },
    {
      id: 'habits',
      icon: 'star',
      text: 'This sounds like something worth turning into habits.',
    },
    {
      id: 'effort',
      icon: 'gauge',
      label: 'Estimated effort:',
      value: 'Medium',
      subtext: 'Great balance between challenge and consistency.',
    },
  ] as InsightItem[],
  reminder: "Remember: Progress, not perfection. I'm here to help you stay on track.",
};

export const DEMO_TRANSCRIPT_SEGMENTS: TranscriptSegment[] = [
  {
    id: '1',
    timestampSeconds: 2,
    timestampLabel: '00:02',
    text: 'I want to build muscle and improve my stamina',
  },
  {
    id: '2',
    timestampSeconds: 14,
    timestampLabel: '00:14',
    text: "I'm planning to work out five days a week with a focus on strength training.",
  },
  {
    id: '3',
    timestampSeconds: 26,
    timestampLabel: '00:26',
    text: "For nutrition, I'll stick to high protein meals and balanced food.",
  },
];

export const TASK_FILTERS = ['All', 'Today', 'Upcoming', 'Done'] as const;
export type TaskFilter = (typeof TASK_FILTERS)[number];

export type TaskItem = {
  id: string;
  title: string;
  time: string;
  done: boolean;
  group: 'today' | 'tomorrow' | 'upcoming';
  notes?: string;
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
  { id: 'account', label: 'Edit Profile', icon: 'user' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'calendar', label: 'Calendar Sync', icon: 'calendar' },
  { id: 'export', label: 'Export Data', icon: 'download' },
  { id: 'help', label: 'Support', icon: 'help' },
  { id: 'billing', label: 'Billing', icon: 'credit-card' },
  { id: 'about', label: 'About Bobble', icon: 'info' },
] as const;

export const GAMIFICATION = {
  level: 12,
  title: 'Mind Explorer',
  currentXp: 2450,
  maxXp: 3000,
  stats: {
    streak: 14,
    bobbles: 47,
    tasks: 128,
    xp: 2450,
  },
  badges: [
    { label: 'Early Bird', tone: 'blue' },
    { label: 'Focus Master', tone: 'yellow' },
    { label: 'Bobbler', tone: 'green' },
  ],
} as const;

export const PROFILE_USER = {
  name: 'Steven',
  handle: '@steven_thinks',
  email: 'steven@example.com',
  phone: '+61 457 596 267',
  address: '',
} as const;

export function getBobbleById(id: string): BobbleItem | undefined {
  return DEMO_BOBBLES.find((b) => b.id === id);
}

export function filterBobbles(filter: BobbleFilter, query: string): BobbleItem[] {
  const normalized = query.trim().toLowerCase();
  const category = filter === 'All' ? null : FILTER_TO_CATEGORY[filter];

  return DEMO_BOBBLES.filter((bobble) => {
    const matchesFilter = category === null || bobble.category === category;
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
