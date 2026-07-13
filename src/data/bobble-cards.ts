import { ImageSourcePropType } from 'react-native';

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
