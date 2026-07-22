import { EncodingType, cacheDirectory, writeAsStringAsync } from 'expo-file-system/legacy';
import Share from 'react-native-share';

import { bobblesApi, profileApi, tasksApi } from '@/src/api';
import type { Bobble } from '@/src/features/bobbles/types';
import { bobbleDurationMin, formatBobbleDateLabel } from '@/src/features/bobbles/format';
import type { ProfilePayload } from '@/src/features/profile/types';
import type { Task } from '@/src/features/tasks/types';

const CSV_HEADERS = [
  'type',
  'title',
  'category',
  'status',
  'duration_min',
  'done',
  'due_at',
  'priority',
  'notes',
  'summary',
  'created_at',
] as const;

function escapeCsv(value: string | number | boolean | null | undefined): string {
  const text = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isShareCancelled(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes('cancel') ||
    message.includes('dismiss') ||
    message.includes('did not share') ||
    message.includes('user denied')
  );
}

async function fetchExportData(): Promise<{
  bobbles: Bobble[];
  tasks: Task[];
  profile: ProfilePayload | null;
}> {
  const [bobbles, tasks, profile] = await Promise.all([
    bobblesApi.listBobbles({ limit: 500 }),
    tasksApi.listTasks('all'),
    profileApi.fetchProfile().catch(() => null),
  ]);

  return { bobbles, tasks, profile };
}

function bobbleSummary(bobble: Bobble): string {
  return (
    bobble.summary?.bullets?.map((bullet) => `${bullet.label}: ${bullet.value}`).join(' | ') ?? ''
  );
}

function buildUnifiedCsv(bobbles: Bobble[], tasks: Task[]): string {
  const rows: string[] = [CSV_HEADERS.join(',')];

  for (const bobble of bobbles) {
    rows.push(
      [
        'bobble',
        bobble.title,
        bobble.category,
        bobble.status,
        bobbleDurationMin(bobble),
        '',
        '',
        '',
        '',
        bobbleSummary(bobble),
        formatBobbleDateLabel(bobble.createdAt),
      ]
        .map(escapeCsv)
        .join(','),
    );
  }

  for (const task of tasks) {
    rows.push(
      [
        'task',
        task.title,
        '',
        '',
        '',
        task.done,
        task.dueAt ?? '',
        task.priority,
        task.notes ?? '',
        '',
        task.createdAt,
      ]
        .map(escapeCsv)
        .join(','),
    );
  }

  return rows.join('\n');
}

function buildExportHtml(
  bobbles: Bobble[],
  tasks: Task[],
  userName?: string,
): string {
  const exportedAt = new Date().toLocaleString();
  const bobbleRows = bobbles
    .map(
      (bobble) => `
        <tr>
          <td>${escapeHtml(bobble.title)}</td>
          <td>${escapeHtml(bobble.category)}</td>
          <td>${escapeHtml(bobble.status)}</td>
          <td>${bobbleDurationMin(bobble)} min</td>
          <td>${escapeHtml(formatBobbleDateLabel(bobble.createdAt))}</td>
        </tr>
        ${bobbleSummary(bobble) ? `<tr><td colspan="5" class="summary">${escapeHtml(bobbleSummary(bobble))}</td></tr>` : ''}`,
    )
    .join('');

  const taskRows = tasks
    .map(
      (task) => `
        <tr>
          <td>${escapeHtml(task.title)}</td>
          <td>${task.done ? 'Done' : 'Open'}</td>
          <td>${escapeHtml(task.dueAt ? formatBobbleDateLabel(task.dueAt) : '—')}</td>
          <td>${escapeHtml(task.priority)}</td>
          <td>${escapeHtml(task.notes ?? '')}</td>
        </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #111; padding: 24px; }
      h1 { font-size: 22px; margin: 0 0 4px; color: #9F52F2; }
      .meta { color: #6B7280; font-size: 13px; margin-bottom: 24px; }
      h2 { font-size: 16px; margin: 24px 0 8px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
      th, td { border-bottom: 1px solid #E5E7EB; padding: 8px 6px; text-align: left; font-size: 12px; vertical-align: top; }
      th { color: #6B7280; font-weight: 600; }
      .summary { color: #4B5563; font-size: 11px; padding-top: 0; }
      .empty { color: #9CA3AF; font-style: italic; }
    </style>
  </head>
  <body>
    <h1>Bobble Data Export</h1>
    <p class="meta">
      ${userName ? `Account: ${escapeHtml(userName)}<br />` : ''}
      Exported: ${escapeHtml(exportedAt)}<br />
      ${bobbles.length} bobble${bobbles.length === 1 ? '' : 's'}, ${tasks.length} task${tasks.length === 1 ? '' : 's'}
    </p>

    <h2>Bobbles</h2>
    ${
      bobbles.length
        ? `<table>
            <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Duration</th><th>Created</th></tr></thead>
            <tbody>${bobbleRows}</tbody>
          </table>`
        : '<p class="empty">No bobbles to export.</p>'
    }

    <h2>Tasks</h2>
    ${
      tasks.length
        ? `<table>
            <thead><tr><th>Title</th><th>Status</th><th>Due</th><th>Priority</th><th>Notes</th></tr></thead>
            <tbody>${taskRows}</tbody>
          </table>`
        : '<p class="empty">No tasks to export.</p>'
    }
  </body>
</html>`;
}

async function shareFile(path: string, type: string, filename: string): Promise<void> {
  const url = path.startsWith('file://') ? path : `file://${path}`;
  await Share.open({
    url,
    type,
    filename,
    title: 'Bobble export',
  });
}

export async function exportUserDataCsv(): Promise<void> {
  const { bobbles, tasks } = await fetchExportData();
  const csv = buildUnifiedCsv(bobbles, tasks);
  const path = `${cacheDirectory}bobble-export-${Date.now()}.csv`;
  await writeAsStringAsync(path, csv, { encoding: EncodingType.UTF8 });
  await shareFile(path, 'text/csv', `bobble-export-${Date.now()}.csv`);
}

async function printHtmlToPdf(html: string): Promise<string> {
  try {
    const Print = await import('expo-print');
    const { uri } = await Print.printToFileAsync({ html });
    return uri;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('ExpoPrint') || message.includes('native module')) {
      throw new Error(
        'PDF export requires a new native build. Run: npx expo run:ios (or run:android)',
      );
    }
    throw error;
  }
}

export async function exportUserDataPdf(): Promise<void> {
  const { bobbles, tasks, profile } = await fetchExportData();
  const html = buildExportHtml(bobbles, tasks, profile?.user.name);
  const uri = await printHtmlToPdf(html);
  await shareFile(uri, 'application/pdf', `bobble-export-${Date.now()}.pdf`);
}

export function isExportShareCancelled(error: unknown): boolean {
  return isShareCancelled(error);
}
