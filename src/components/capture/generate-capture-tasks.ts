import type { GeneratedTask } from './generated-task-row';

type CaptureBullet = { label: string; value: string };

export function buildTasksFromCapture(bullets: readonly CaptureBullet[]): Omit<GeneratedTask, 'id'>[] {
  return bullets.map((bullet) => {
    if (bullet.label === 'Reminder') {
      return { title: 'Add reminders for workouts' };
    }

    return { title: `${bullet.label}: ${bullet.value}` };
  });
}

export const TASK_STAGGER_MS = 450;
