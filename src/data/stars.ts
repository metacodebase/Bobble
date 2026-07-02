import {
  Award,
  Calendar,
  CheckCircle2,
  Flame,
  Mic,
  Moon,
  Sunrise,
  Target,
  Trophy,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';

import type { BadgeTone } from '@/src/features/auth/types';

export type StarDefinition = {
  id: string;
  label: string;
  tone: BadgeTone;
  icon: LucideIcon;
  /** One-line summary of the reward's theme. */
  summary: string;
  /** Concrete requirement telling the user how to unlock the star. */
  howToEarn: string;
};

/**
 * The full catalog of stars a user can earn. Earned stars are matched against
 * the user's `gamification.badges` by `label`, so labels here must stay in sync
 * with the labels the backend awards.
 */
export const STAR_CATALOG: StarDefinition[] = [
  {
    id: 'early-bird',
    label: 'Early Bird',
    tone: 'blue',
    icon: Sunrise,
    summary: 'Start your day with a thought.',
    howToEarn: 'Capture a bobble before 8:00 AM.',
  },
  {
    id: 'focus-master',
    label: 'Focus Master',
    tone: 'yellow',
    icon: Target,
    summary: 'Turn ideas into action.',
    howToEarn: 'Complete 10 tasks generated from your bobbles.',
  },
  {
    id: 'bobbler',
    label: 'Bobbler',
    tone: 'green',
    icon: Mic,
    summary: 'Build the capture habit.',
    howToEarn: 'Record your first 5 bobbles.',
  },
  {
    id: 'streak-keeper',
    label: 'Streak Keeper',
    tone: 'red',
    icon: Flame,
    summary: 'Stay consistent every day.',
    howToEarn: 'Keep a 7-day capture streak going.',
  },
  {
    id: 'night-owl',
    label: 'Night Owl',
    tone: 'purple',
    icon: Moon,
    summary: 'Catch late-night ideas.',
    howToEarn: 'Capture a bobble after 10:00 PM.',
  },
  {
    id: 'planner',
    label: 'Planner',
    tone: 'blue',
    icon: Calendar,
    summary: 'Keep your calendar in sync.',
    howToEarn: 'Sync a task to your calendar.',
  },
  {
    id: 'task-champion',
    label: 'Task Champion',
    tone: 'yellow',
    icon: CheckCircle2,
    summary: 'Finish what you start.',
    howToEarn: 'Complete 50 tasks in total.',
  },
  {
    id: 'xp-collector',
    label: 'XP Collector',
    tone: 'green',
    icon: Zap,
    summary: 'Level up steadily.',
    howToEarn: 'Reach 1,000 XP.',
  },
  {
    id: 'centurion',
    label: 'Centurion',
    tone: 'purple',
    icon: Trophy,
    summary: 'A true power user.',
    howToEarn: 'Record 100 bobbles.',
  },
  {
    id: 'legend',
    label: 'Legend',
    tone: 'red',
    icon: Award,
    summary: 'Mastery unlocked.',
    howToEarn: 'Maintain a 30-day streak.',
  },
];
