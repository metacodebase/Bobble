export type BobbleCategory = 'ideas' | 'tasks' | 'brain-dump' | 'reflections';

export type BobbleStatus = 'processing' | 'ready' | 'failed';

export type BobbleIconVariant = 'dumbbell' | 'leaf' | 'bell' | 'luggage' | 'lightbulb';

export type MindMapPosition = 'top' | 'left' | 'right' | 'bottom-left' | 'bottom-right';

export type InsightIcon = 'smile' | 'chart' | 'star' | 'gauge';

export interface SummaryBullet {
  label: string;
  value: string;
}

export interface MindMapNode {
  id: string;
  title: string;
  subtitle: string;
  position: MindMapPosition;
  backgroundColor?: string;
  lineColor?: string;
}

export interface InsightItem {
  id: string;
  icon: InsightIcon;
  text?: string;
  label?: string;
  value?: string;
  subtext?: string;
}

export interface TranscriptSegment {
  id: string;
  timestampSeconds: number;
  text: string;
}

export interface Bobble {
  _id: string;
  user: string;
  title: string;
  category: BobbleCategory;
  status: BobbleStatus;
  durationSec: number;
  audioUrl?: string;
  transcript?: string;
  transcriptSegments?: TranscriptSegment[];
  summary?: {
    intro?: string;
    bullets: SummaryBullet[];
  };
  mindScore?: number;
  mindMap?: {
    centerTitle: string;
    nodes: MindMapNode[];
  };
  insights?: {
    title?: string;
    reminder?: string;
    items: InsightItem[];
  };
  iconVariant?: BobbleIconVariant;
  suggestedTasks?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBobbleBody {
  title: string;
  category?: BobbleCategory;
  status?: BobbleStatus;
  durationSec?: number;
  audioUrl?: string;
  transcript?: string;
  transcriptSegments?: TranscriptSegment[];
  summary?: {
    intro?: string;
    bullets: SummaryBullet[];
  };
  mindScore?: number;
  mindMap?: {
    centerTitle: string;
    nodes: MindMapNode[];
  };
  insights?: {
    title?: string;
    reminder?: string;
    items: InsightItem[];
  };
  iconVariant?: BobbleIconVariant;
  suggestedTasks?: string[];
  /** Leave bobble unprocessed until audio upload triggers the AI pipeline. */
  skipProcess?: boolean;
}

export type UpdateBobbleBody = Partial<Omit<CreateBobbleBody, 'skipProcess'>>;

export interface ListBobblesParams {
  category?: BobbleCategory;
  status?: BobbleStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UploadAudioBody {
  audioBase64: string;
  mimeType?: string;
  /** Default true — run AssemblyAI + OpenAI after storing the file. */
  process?: boolean;
}

export const DEFAULT_BOBBLE_CATEGORY: BobbleCategory = 'tasks';

/** Maps capture kinds from the recorder UI onto API categories. Defaults to `tasks`. */
export function categoryFromCaptureKind(
  kind?: 'bobble' | 'idea' | 'task' | 'brain-dump' | 'reflection' | null
): BobbleCategory {
  switch (kind) {
    case 'idea':
      return 'ideas';
    case 'task':
      return 'tasks';
    case 'brain-dump':
      return 'brain-dump';
    case 'reflection':
      return 'reflections';
    case 'bobble':
    default:
      return DEFAULT_BOBBLE_CATEGORY;
  }
}
