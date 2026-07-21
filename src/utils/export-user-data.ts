import { EncodingType, cacheDirectory, writeAsStringAsync } from 'expo-file-system/legacy';
import Share from 'react-native-share';

import { bobblesApi, tasksApi } from '@/src/api';
import type { Bobble } from '@/src/features/bobbles/types';
import type { Task } from '@/src/features/tasks/types';
import { formatBobbleDateLabel, bobbleDurationMin } from '@/src/features/bobbles/format';

function escapeCsv(value: string | number | boolean | null | undefined): string {
  const text = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function bobblesToCsv(bobbles: Bobble[]): string {
  const headers = [
    'type',
    'title',
    'category',
    'status',
    'duration_min',
    'summary',
    'created_at',
  ];
  const rows = bobbles.map((bobble) => {
    const summary = bobble.summary?.bullets
      ?.map((bullet) => `${bullet.label}: ${bullet.value}`)
      .join(' | ');
    return [
      'bobble',
      bobble.title,
      bobble.category,
      bobble.status,
      bobbleDurationMin(bobble),
      summary ?? '',
      formatBobbleDateLabel(bobble.createdAt),
    ]
      .map(escapeCsv)
      .join(',');
  });
  return [headers.join(','), ...rows].join('\n');
}

function tasksToCsv(tasks: Task[]): string {
  const headers = ['type', 'title', 'done', 'due_at', 'priority', 'notes', 'created_at'];
  const rows = tasks.map((task) =>
    [
      'task',
      task.title,
      task.done,
      task.dueAt ?? '',
      task.priority,
      task.notes ?? '',
      task.createdAt,
    ]
      .map(escapeCsv)
      .join(','),
  );
  return [headers.join(','), ...rows].join('\n');
}

async function shareCsvFile(content: string, filename: string): Promise<void> {
  const path = `${cacheDirectory}${filename}`;
  await writeAsStringAsync(path, content, { encoding: EncodingType.UTF8 });
  const url = path.startsWith('file://') ? path : `file://${path}`;
  await Share.open({
    url,
    type: 'text/csv',
    filename,
    title: 'Bobble export',
  });
}

export async function exportUserDataCsv(): Promise<void> {
  const [bobbles, tasks] = await Promise.all([
    bobblesApi.listBobbles({ limit: 500 }),
    tasksApi.listTasks('all'),
  ]);

  const csv = `${bobblesToCsv(bobbles)}\n\n${tasksToCsv(tasks)}`;
  await shareCsvFile(csv, `bobble-export-${Date.now()}.csv`);
}
