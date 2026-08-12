import { Href, router } from 'expo-router';
import { Image } from 'expo-image';
import { Check } from 'lucide-react-native';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BobbleDetailToolbar } from '@/src/components/bobbles/bobble-detail-toolbar';
import { SecondaryButton } from '@/src/components/home/secondary-button';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { getClosestBobbleCard } from '@/src/data/bobble-cards';
import type { BobbleCategory } from '@/src/features/bobbles/types';
import { useBobbleToolbarActions } from '@/src/hooks/use-bobble-toolbar-actions';
import { Typography } from '@/src/theme/fonts';
import { androidSafeBottom, androidSafeTop } from '@/src/utils/safe-padding';

const SAVE_TEXT = '#17164B';
const SUCCESS_BACKGROUND = require('@/src/assets/images/background/four.png');

type BobbleSaveSuccessProps = {
  title: string;
  dateLabel: string;
  durationMin: number;
  category: BobbleCategory;
  tasks: { title: string }[];
  bobbleId?: string;
  onViewBobble: () => void;
  onHome: () => void;
};

export function BobbleSaveSuccess({
  title,
  dateLabel,
  durationMin,
  category,
  tasks,
  bobbleId,
  onViewBobble,
  onHome,
}: BobbleSaveSuccessProps) {
  const insets = useSafeAreaInsets();
  const { handleAddTasks, handlePin, isAddingTasks, isPinning, bobble } = useBobbleToolbarActions({
    bobbleId,
  });
  const card = getClosestBobbleCard({ title, tasks, category });

  return (
    <ImageBackground
      source={SUCCESS_BACKGROUND}
      style={[styles.root, { paddingTop: androidSafeTop(insets.top) + 8 }]}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.title}>Bobble Saved!</Text>
          <Text style={styles.subtitle}>Your thoughts are safe and ready whenever you are.</Text>
        </View>

        <View style={styles.visual}>
          <Image source={card.image} style={styles.cardImage} contentFit="contain" />
        </View>

        <View style={styles.card}>
          <View style={styles.cardCopy}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.cardMeta}>
              {dateLabel} · {durationMin} min
            </Text>
          </View>
          <View style={styles.checkCircle}>
            <Check size={18} color="#FFFFFF" strokeWidth={3} />
          </View>
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="View Bobble" showChevron={false} onPress={onViewBobble} />
          <SecondaryButton label="Home" onPress={onHome} />
        </View>
      </View>

      <View
        style={[
          styles.toolbar,
          {
            paddingBottom: androidSafeBottom(insets.bottom, 24) + 8,
          },
        ]}
      >
        <BobbleDetailToolbar
          safeBottom={false}
          onShare={() =>
            router.push({
              pathname: '/share',
              params: {
                cardId: card.id,
                ...(bobbleId ? { bobbleId } : {}),
              },
            } as Href)
          }
          onAddTask={handleAddTasks}
          onPin={handlePin}
          onMore={() => {
            if (bobbleId) {
              router.push({ pathname: '/bobble/[id]', params: { id: bobbleId } } as Href);
            }
          }}
          disabled={isAddingTasks || isPinning}
          pinned={bobble?.pinned}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginHorizontal: -24,
  },
  content: {
    flex: 1,
    gap: 10,
    paddingTop: 16,
    paddingHorizontal: 24,
    justifyContent: 'space-evenly',
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  title: {
    ...Typography.heading,
    fontSize: 28,
    lineHeight: 36,
    color: SAVE_TEXT,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    fontSize: 16,
    lineHeight: 24,
    color: '#7C3AED',
    textAlign: 'center',
  },
  visual: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
    minHeight: 180,
  },
  cardImage: {
    width: 170,
    aspectRatio: 4096 / 5300,
    borderRadius: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#9F52F2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardCopy: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    ...Typography.formLabel,
    fontSize: 16,
    lineHeight: 22,
    color: SAVE_TEXT,
  },
  cardMeta: {
    ...Typography.caption,
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22C55E',
  },
  actions: {
    gap: 12,
  },
  toolbar: {
    paddingHorizontal: 24,
    paddingTop: 4,
  },
});
