import type { Bobble } from '@/src/features/bobbles/types';
import type { CreateBobbleBody } from '@/src/features/bobbles/types';

export function duplicateBobbleTitle(title: string): string {
  const trimmed = title.trim() || 'Bobble';
  return `${trimmed} (Copy)`;
}

export function buildDuplicateBobbleBody(bobble: Bobble): CreateBobbleBody {
  return {
    title: duplicateBobbleTitle(bobble.title),
    category: bobble.category,
    status: bobble.status === 'failed' ? 'ready' : bobble.status,
    durationSec: bobble.durationSec,
    audioUrl: bobble.audioUrl,
    transcript: bobble.transcript,
    transcriptSegments: bobble.transcriptSegments,
    summary: bobble.summary,
    mindScore: bobble.mindScore,
    mindMap: bobble.mindMap,
    insights: bobble.insights,
    iconVariant: bobble.iconVariant,
    suggestedTasks: bobble.suggestedTasks,
    skipProcess: true,
  };
}

export function formatBobbleSummaryExport(
  bobble: Bobble,
  options?: { dateLabel?: string; durationMin?: number },
): string {
  const lines: string[] = [bobble.title.trim() || 'Bobble', ''];

  if (options?.dateLabel) {
    const duration =
      options.durationMin !== undefined ? ` · ${options.durationMin} min` : '';
    lines.push(`${options.dateLabel}${duration}`, '');
  }

  if (bobble.summary?.intro?.trim()) {
    lines.push(bobble.summary.intro.trim(), '');
  }

  if (bobble.summary?.bullets?.length) {
    lines.push('Summary');
    for (const bullet of bobble.summary.bullets) {
      lines.push(`• ${bullet.label}: ${bullet.value}`);
    }
    lines.push('');
  }

  if (bobble.insights?.reminder?.trim()) {
    lines.push('Reminder', bobble.insights.reminder.trim(), '');
  }

  if (bobble.insights?.items?.length) {
    lines.push('Insights');
    for (const item of bobble.insights.items) {
      const detail =
        item.text?.trim() ||
        [item.label, item.value].filter(Boolean).join(': ') ||
        item.subtext?.trim();
      if (detail) lines.push(`• ${detail}`);
    }
    lines.push('');
  }

  if (bobble.transcript?.trim()) {
    lines.push('Transcript', bobble.transcript.trim());
  }

  return lines.join('\n').trim();
}
