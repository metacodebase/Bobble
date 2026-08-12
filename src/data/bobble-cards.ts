import { ImageSourcePropType } from 'react-native';

import type { BobbleCategory } from '@/src/features/bobbles/types';

export type BobbleCard = {
  id: string;
  label: string;
  image: ImageSourcePropType;
};

export const BOBBLE_CARDS: BobbleCard[] = [
  {
    id: 'brain-dump',
    label: 'Brain Dump',
    image: require('@/src/assets/images/bobble-cards/brain-dump.png'),
  },
  {
    id: 'brain-dump-1',
    label: 'Brain Dump',
    image: require('@/src/assets/images/bobble-cards/brain-dump-1.png'),
  },
  {
    id: 'crypto-bobble',
    label: 'Crypto Bobble',
    image: require('@/src/assets/images/bobble-cards/crypto-bobble.png'),
  },
  {
    id: 'crypto-bobble-1',
    label: 'Crypto Bobble',
    image: require('@/src/assets/images/bobble-cards/crypto-bobble-1.png'),
  },
  {
    id: 'reflection',
    label: 'Reflection',
    image: require('@/src/assets/images/bobble-cards/reflection.png'),
  },
  {
    id: 'reflection-1',
    label: 'Reflection',
    image: require('@/src/assets/images/bobble-cards/reflection-1.png'),
  },
  {
    id: 'reflection-2',
    label: 'Reflection',
    image: require('@/src/assets/images/bobble-cards/reflection-2.png'),
  },
  {
    id: 'reflection-3',
    label: 'Reflection',
    image: require('@/src/assets/images/bobble-cards/reflection-3.png'),
  },
  {
    id: 'task-bobble',
    label: 'Task Bobble',
    image: require('@/src/assets/images/bobble-cards/task-bobble.png'),
  },
  {
    id: 'task-bobble-1',
    label: 'Task Bobble',
    image: require('@/src/assets/images/bobble-cards/task-bobble-1.png'),
  },
  {
    id: 'task-bobble-2',
    label: 'Task Bobble',
    image: require('@/src/assets/images/bobble-cards/task-bobble-2.png'),
  },
  {
    id: 'task-bobble-3',
    label: 'Task Bobble',
    image: require('@/src/assets/images/bobble-cards/task-bobble-3.png'),
  },
  {
    id: 'workout-bobble',
    label: 'Workout Bobble',
    image: require('@/src/assets/images/bobble-cards/workout-bobble.png'),
  },
  {
    id: 'workout-bobble-1',
    label: 'Workout Bobble',
    image: require('@/src/assets/images/bobble-cards/workout-bobble-1.png'),
  },
  {
    id: 'yellowstone',
    label: 'Yellowstone',
    image: require('@/src/assets/images/bobble-cards/yellowstone.png'),
  },
  {
    id: 'yellowstone-1',
    label: 'Yellowstone',
    image: require('@/src/assets/images/bobble-cards/yellowstone-1.png'),
  },
  {
    id: 'idea-bobble',
    label: 'Idea Bobble',
    image: require('@/src/assets/images/bobble-cards/idea-bobble.png'),
  },
];

type BobbleCardTheme = {
  ids: string[];
  categories?: BobbleCategory[];
  keywords: string[];
};

const BOBBLE_CARD_THEMES: BobbleCardTheme[] = [
  {
    ids: ['workout-bobble', 'workout-bobble-1'],
    keywords: [
      'workout',
      'exercise',
      'fitness',
      'gym',
      'run',
      'running',
      'yoga',
      'strength',
      'training',
      'cardio',
      'muscle',
      'sport',
      'health',
    ],
  },
  {
    ids: ['yellowstone', 'yellowstone-1'],
    keywords: [
      'travel',
      'trip',
      'vacation',
      'holiday',
      'flight',
      'hotel',
      'hike',
      'hiking',
      'camping',
      'nature',
      'park',
      'outdoor',
      'adventure',
    ],
  },
  {
    ids: ['crypto-bobble', 'crypto-bobble-1'],
    keywords: [
      'crypto',
      'bitcoin',
      'finance',
      'money',
      'budget',
      'invest',
      'investment',
      'stock',
      'market',
      'saving',
      'bank',
    ],
  },
  {
    ids: ['reflection', 'reflection-1', 'reflection-2', 'reflection-3'],
    categories: ['reflections'],
    keywords: [
      'reflect',
      'reflection',
      'journal',
      'gratitude',
      'feeling',
      'emotion',
      'therapy',
      'memory',
      'lesson',
      'mindful',
    ],
  },
  {
    ids: ['idea-bobble'],
    categories: ['ideas'],
    keywords: [
      'idea',
      'brainstorm',
      'invent',
      'concept',
      'startup',
      'design',
      'create',
      'creative',
      'inspiration',
    ],
  },
  {
    ids: ['brain-dump', 'brain-dump-1'],
    categories: ['brain-dump'],
    keywords: ['brain dump', 'thoughts', 'notes', 'overwhelmed', 'mind', 'unload'],
  },
  {
    ids: ['task-bobble', 'task-bobble-1', 'task-bobble-2', 'task-bobble-3'],
    categories: ['tasks'],
    keywords: [
      'task',
      'todo',
      'to-do',
      'reminder',
      'deadline',
      'meeting',
      'plan',
      'schedule',
      'appointment',
      'call',
      'email',
      'buy',
      'shopping',
      'groceries',
      'work',
    ],
  },
];

function stableIndex(value: string, length: number) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash) % length;
}

export function getClosestBobbleCard(input: {
  title: string;
  tasks?: { title: string }[];
  category?: BobbleCategory;
}): BobbleCard {
  const searchableText = [input.title, ...(input.tasks?.map((task) => task.title) ?? [])]
    .join(' ')
    .toLowerCase();
  let bestTheme = BOBBLE_CARD_THEMES.at(-1)!;
  let bestScore = -1;

  for (const theme of BOBBLE_CARD_THEMES) {
    const keywordScore = theme.keywords.reduce(
      (score, keyword) => score + (searchableText.includes(keyword) ? 2 : 0),
      0
    );
    const categoryScore = input.category && theme.categories?.includes(input.category) ? 1 : 0;
    const score = keywordScore + categoryScore;
    if (score > bestScore) {
      bestTheme = theme;
      bestScore = score;
    }
  }

  const id =
    bestTheme.ids[stableIndex(searchableText || input.category || 'task', bestTheme.ids.length)];
  return BOBBLE_CARDS.find((card) => card.id === id) ?? BOBBLE_CARDS[0];
}

export function getRandomBobbleCard(): BobbleCard {
  return BOBBLE_CARDS[Math.floor(Math.random() * BOBBLE_CARDS.length)];
}

export function getBobbleCardById(id?: string): BobbleCard {
  if (id) {
    const match = BOBBLE_CARDS.find((card) => card.id === id);
    if (match) return match;
  }

  return getRandomBobbleCard();
}
