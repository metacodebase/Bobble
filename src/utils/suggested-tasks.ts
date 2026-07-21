export type SuggestedTask = {
  title: string;
  dueAt?: string | null;
};

function parseDueAt(value: unknown): string | null | undefined {
  if (value === null) return null;
  if (value === undefined || value === '') return undefined;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

/** Accept legacy string[] or structured { title, dueAt? } from the API. */
export function normalizeSuggestedTasks(raw: unknown): SuggestedTask[] {
  if (!Array.isArray(raw)) return [];

  const tasks: SuggestedTask[] = [];
  for (const item of raw) {
    if (typeof item === 'string') {
      const title = item.trim();
      if (title) tasks.push({ title });
      continue;
    }

    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const title = String(row.title ?? '').trim();
    if (!title) continue;

    const dueAt = parseDueAt(row.dueAt);
    tasks.push(dueAt === undefined ? { title } : { title, dueAt });
  }

  return tasks;
}

export function formatSuggestedDueLabel(dueAt?: string | null): string | null {
  if (!dueAt) return null;
  const date = new Date(dueAt);
  if (Number.isNaN(date.getTime())) return null;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDue = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDiff = Math.round((startOfDue.getTime() - startOfToday.getTime()) / 86_400_000);

  const time = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  if (dayDiff === 0) return `Today · ${time}`;
  if (dayDiff === 1) return `Tomorrow · ${time}`;
  if (dayDiff === -1) return `Yesterday · ${time}`;

  const dateLabel = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  return `${dateLabel} · ${time}`;
}
