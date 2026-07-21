import {
  DEMO_BOBBLES,
  DEMO_BOBBLE_DETAIL,
  DEMO_INSIGHTS,
  DEMO_MIND_MAP,
  DEMO_TRANSCRIPT_SEGMENTS,
} from '@/src/data/demo-data';
import type {
  Bobble,
  CreateBobbleBody,
  ListBobblesParams,
  UpdateBobbleBody,
  UploadAudioBody,
} from '@/src/features/bobbles/types';

const OFFLINE_USER_ID = 'offline-demo-user';

function newId(): string {
  return `offline-bobble-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function notFound(): never {
  const error = Object.assign(new Error('Bobble not found'), { status: 404 });
  throw error;
}

function demoToBobble(item: (typeof DEMO_BOBBLES)[number]): Bobble {
  const now = new Date().toISOString();
  return {
    _id: item.id,
    user: OFFLINE_USER_ID,
    title: item.title,
    category: item.category,
    status: 'ready',
    durationSec: item.durationMin * 60,
    iconVariant: item.iconVariant,
    transcript: DEMO_BOBBLE_DETAIL.transcript,
    transcriptSegments: DEMO_TRANSCRIPT_SEGMENTS.map(({ id, timestampSeconds, text }) => ({
      id,
      timestampSeconds,
      text,
    })),
    summary: {
      intro: 'Here is what I captured from your note.',
      bullets: [...DEMO_BOBBLE_DETAIL.bullets],
    },
    mindScore: DEMO_BOBBLE_DETAIL.mindScore,
    mindMap: {
      centerTitle: DEMO_MIND_MAP.centerTitle,
      nodes: DEMO_MIND_MAP.nodes.map((node) => ({
        id: node.id,
        title: node.title,
        subtitle: node.subtitle,
        position: node.position,
        backgroundColor: node.backgroundColor,
        lineColor: node.lineColor,
      })),
    },
    insights: {
      title: DEMO_INSIGHTS.title,
      reminder: DEMO_INSIGHTS.reminder,
      items: [...DEMO_INSIGHTS.items],
    },
    createdAt: now,
    updatedAt: now,
  };
}

let store: Bobble[] = DEMO_BOBBLES.map(demoToBobble);

export async function listBobbles(params: ListBobblesParams = {}): Promise<Bobble[]> {
  let items = [...store];
  items = items.filter((b) => !b.archived);
  if (params.category) {
    items = items.filter((b) => b.category === params.category);
  }
  if (params.status) {
    items = items.filter((b) => b.status === params.status);
  }
  if (params.search?.trim()) {
    const q = params.search.trim().toLowerCase();
    items = items.filter((b) => b.title.toLowerCase().includes(q));
  }
  return items;
}

export async function getBobble(id: string): Promise<Bobble> {
  const bobble = store.find((b) => b._id === id);
  if (!bobble) notFound();
  return bobble;
}

export async function createBobble(body: CreateBobbleBody): Promise<Bobble> {
  const now = new Date().toISOString();
  const bobble: Bobble = {
    _id: newId(),
    user: OFFLINE_USER_ID,
    title: body.title,
    category: body.category ?? 'tasks',
    status: 'ready',
    durationSec: body.durationSec ?? 0,
    transcript: body.transcript ?? DEMO_BOBBLE_DETAIL.transcript,
    transcriptSegments:
      body.transcriptSegments ??
      DEMO_TRANSCRIPT_SEGMENTS.map((s) => ({
        id: s.id,
        timestampSeconds: s.timestampSeconds,
        text: s.text,
      })),
    summary: body.summary ?? {
      intro: 'Here is what I captured from your note.',
      bullets: [...DEMO_BOBBLE_DETAIL.bullets],
    },
    mindScore: body.mindScore ?? DEMO_BOBBLE_DETAIL.mindScore,
    mindMap: body.mindMap ?? {
      centerTitle: body.title,
      nodes: DEMO_MIND_MAP.nodes.map((node) => ({
        id: node.id,
        title: node.title,
        subtitle: node.subtitle,
        position: node.position,
        backgroundColor: node.backgroundColor,
        lineColor: node.lineColor,
      })),
    },
    insights: body.insights ?? {
      title: DEMO_INSIGHTS.title,
      reminder: DEMO_INSIGHTS.reminder,
      items: [...DEMO_INSIGHTS.items],
    },
    iconVariant: body.iconVariant,
    createdAt: now,
    updatedAt: now,
  };
  store = [bobble, ...store];
  return bobble;
}

export async function updateBobble(id: string, body: UpdateBobbleBody): Promise<Bobble> {
  const index = store.findIndex((b) => b._id === id);
  if (index < 0) notFound();
  const updated: Bobble = {
    ...store[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };
  store = store.map((b, i) => (i === index ? updated : b));
  return updated;
}

export async function deleteBobble(id: string): Promise<{ id: string }> {
  store = store.filter((b) => b._id !== id);
  return { id };
}

export async function deleteBobblesBulk(ids: string[]): Promise<void> {
  const idSet = new Set(ids);
  store = store.filter((b) => !idSet.has(b._id));
}

export async function archiveBobble(id: string): Promise<Bobble> {
  return updateBobble(id, { archived: true });
}

export async function processBobble(id: string): Promise<Bobble> {
  return updateBobble(id, { status: 'ready' });
}

export async function uploadBobbleAudio(id: string, _body: UploadAudioBody): Promise<Bobble> {
  return updateBobble(id, { audioUrl: 'offline://recording' });
}
