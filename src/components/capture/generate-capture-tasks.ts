import type { GeneratedTask } from './generated-task-row';

type CaptureBullet = { label: string; value: string };

export type CaptureTaskTemplate = Omit<GeneratedTask, 'id'> & {
  subtitle?: string;
  kind?: 'workout' | 'reminder';
};

export function buildTasksFromCapture(bullets: readonly CaptureBullet[]): Omit<GeneratedTask, 'id'>[] {
  return bullets.map((bullet) => {
    if (bullet.label === 'Reminder') {
      return { title: 'Add reminders for workouts' };
    }

    return { title: `${bullet.label}: ${bullet.value}` };
  });
}

export function buildWeeklyWorkoutPlanTasks(): CaptureTaskTemplate[] {
  return [
    { title: 'Upper Body & Core', kind: 'workout' },
    { title: 'Lower Body', kind: 'workout' },
    { title: 'Active Recovery / Cardio', kind: 'workout' },
    { title: 'Push (Chest, Shoulders, Triceps)', kind: 'workout' },
    { title: 'Pull (Back, Biceps)', kind: 'workout' },
    { subtitle: 'Everyday', title: 'Set workout reminders', kind: 'reminder' },
  ];
}

export const TASK_STAGGER_MS = 450;
