import { Image } from 'expo-image';
import { Download, Lock, X } from 'lucide-react-native';
import { useMemo } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { ShareAchievementBar } from '@/src/components/share/share-achievement-bar';
import { getBobbleCardById } from '@/src/data/bobble-cards';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';
import { toast } from '@/src/utils/toast';

const SHARE_BACKGROUND = require('@/src/assets/images/background/four.png');
const BOBBLE_CARD_ASPECT_RATIO = 4096 / 5300;

type ShareAchievementProps = {
  cardId?: string;
  onClose: () => void;
};

export function ShareAchievement({ cardId, onClose }: ShareAchievementProps) {
  const insets = useSafeAreaInsets();
  const card = useMemo(() => getBobbleCardById(cardId), [cardId]);

  const handleShareAction = (label: string) => {
    toast.success(`${label} sharing coming soon`);
  };

  return (
    <ImageBackground
      source={SHARE_BACKGROUND}
      style={[
        styles.root,
        {
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 16,
        },
      ]}
      resizeMode="cover"
    >
      <Pressable
        onPress={onClose}
        hitSlop={12}
        style={[styles.closeButton, { top: insets.top + 12 }]}
      >
        <X size={22} color="#17164B" strokeWidth={2} />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        bounces={false}
      >
        <View style={styles.hero}>
          <Text style={styles.title}>Share Your</Text>
          <Text style={styles.title}>Bobble Achievement</Text>
          <Text style={styles.subtitle}>
            You did something amazing! Spread the joy and inspire others.
          </Text>
        </View>

        <View style={styles.cardWrapper}>
          <Image source={card.image} style={styles.cardImage} contentFit="cover" />
        </View>

        <View style={styles.actionsBlock}>
          <ShareAchievementBar
            onFacebook={() => handleShareAction('Facebook')}
            onZapme={() => handleShareAction('Zapme')}
            onMessage={() => handleShareAction('Boice Vox')}
            onCopyLink={() => toast.success('Link copied')}
            onMore={() => handleShareAction('More')}
          />

          <PrimaryButton
            label="Save to Photos"
            icon={Download}
            showChevron={false}
            onPress={() => toast.success('Saved to Photos')}
          />
        </View>

        <View style={styles.footer}>
          <Lock size={14} color="#000" strokeWidth={2} style={{marginHorizontal: 4}}/>
          <Text style={styles.footerText}>Your Bobble, your journey.{'\n'}Share what feels right.</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
  },
  content: {
    flexGrow: 1,
    width: '90%',
    alignSelf: 'center',
    paddingTop: 12,
    gap: 0,
    justifyContent: 'space-evenly',
  },
  hero: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    ...Typography.heading,
    fontSize: 26,
    lineHeight: 34,
    color: '#17164B',
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: BobbleColors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },

  cardWrapper: {
    width: '100%',
    aspectRatio: BOBBLE_CARD_ASPECT_RATIO,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  actionsBlock: {
    width: '100%',
    gap: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    padding: 10,
    backgroundColor: 'rgba(0,0,0, 0.1)',
    width: '100%',
    borderRadius: 10,
  },
  footerText: {
    ...Typography.caption,
    fontSize: 13,
    lineHeight: 18,
    color: '#000',
  },
});
