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

export function buildWeeklyWorkoutPlanTasks(): Omit<GeneratedTask, 'id'>[] {
  return [
    { title: 'Monday — Upper body & core' },
    { title: 'Tuesday — Lower body' },
    { title: 'Wednesday — Active recovery / cardio' },
    { title: 'Thursday — Push (chest, shoulders, triceps)' },
    { title: 'Friday — Pull (back, biceps)' },
    { title: 'Set workout reminders for each session' },
  ];
}

export const TASK_STAGGER_MS = 450;
