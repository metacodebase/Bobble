import type { Bobble, BobbleCategory } from '@/src/features/bobbles/types';

export function formatBobbleDateLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const startThatDay = new Date(date);
  startThatDay.setHours(0, 0, 0, 0);
  const dayDiff = Math.round((startToday.getTime() - startThatDay.getTime()) / 86_400_000);

  const time = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (dayDiff === 0) return `Today, ${time}`;
  if (dayDiff === 1) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}, ${time}`;
}

export function bobbleDurationMin(bobble: Bobble): number {
  if (bobble.durationSec <= 0) return 1;
  return Math.max(1, Math.round(bobble.durationSec / 60));
}

export function formatTimestampLabel(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const BOBBLE_FILTERS = ['All', 'Ideas', 'Tasks', 'Brain Dump', 'Reflections'] as const;
export type BobbleFilter = (typeof BOBBLE_FILTERS)[number];

const FILTER_TO_CATEGORY: Record<Exclude<BobbleFilter, 'All'>, BobbleCategory> = {
  Ideas: 'ideas',
  Tasks: 'tasks',
  'Brain Dump': 'brain-dump',
  Reflections: 'reflections',
};

export function filterCategoryFromChip(filter: BobbleFilter): BobbleCategory | undefined {
  if (filter === 'All') return undefined;
  return FILTER_TO_CATEGORY[filter];
}
