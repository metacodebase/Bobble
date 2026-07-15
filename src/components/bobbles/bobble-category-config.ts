import {
  Bell,
  Dumbbell,
  Leaf,
  Lightbulb,
  Luggage,
  type LucideIcon,
} from 'lucide-react-native';

import {
  DEFAULT_BOBBLE_CATEGORY,
  type BobbleCategory,
  type BobbleIconVariant,
} from '@/src/features/bobbles/types';

export type BobbleCategoryStyle = {
  label: string;
  tagBackground: string;
  tagColor: string;
};

export const BOBBLE_CATEGORY_STYLES: Record<BobbleCategory, BobbleCategoryStyle> = {
  ideas: {
    label: 'Ideas',
    tagBackground: '#E0F2FE',
    tagColor: '#0284C7',
  },
  tasks: {
    label: 'Tasks',
    tagBackground: '#DCFCE7',
    tagColor: '#16A34A',
  },
  'brain-dump': {
    label: 'Brain Dump',
    tagBackground: '#EDE9FE',
    tagColor: '#7C3AED',
  },
  reflections: {
    label: 'Reflections',
    tagBackground: '#FFEDD5',
    tagColor: '#EA580C',
  },
};

/** Resolves styles for known categories; unknown/missing values fall back to default. */
export function getBobbleCategoryStyle(
  category?: string | null
): BobbleCategoryStyle {
  if (category && category in BOBBLE_CATEGORY_STYLES) {
    return BOBBLE_CATEGORY_STYLES[category as BobbleCategory];
  }
  return BOBBLE_CATEGORY_STYLES[DEFAULT_BOBBLE_CATEGORY];
}

export const BOBBLE_ICON_VARIANTS: Record<
  BobbleIconVariant,
  { Icon: LucideIcon; background: string; color: string }
> = {
  dumbbell: { Icon: Dumbbell, background: '#EDE9FE', color: '#7C3AED' },
  leaf: { Icon: Leaf, background: '#DCFCE7', color: '#16A34A' },
  bell: { Icon: Bell, background: '#FEF9C3', color: '#CA8A04' },
  luggage: { Icon: Luggage, background: '#CCFBF1', color: '#0D9488' },
  lightbulb: { Icon: Lightbulb, background: '#EDE9FE', color: '#7C3AED' },
};

export const BOBBLE_FILTER_CHIP_STYLES: Record<string, { background: string; text: string }> = {
  Ideas: { background: '#E0F2FE', text: '#0284C7' },
  Tasks: { background: '#DCFCE7', text: '#16A34A' },
  'Brain Dump': { background: '#EDE9FE', text: '#7C3AED' },
  Reflections: { background: '#FFEDD5', text: '#EA580C' },
};
