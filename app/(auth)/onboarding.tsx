import { Href, router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { WordAccentHeading } from '@/src/components/onboarding/accent-heading';
import { BobbleMascot, MascotVariant } from '@/src/components/onboarding/bobble-mascot';
import {
  ONBOARDING_MASCOT_SIZE,
  OnboardingHeroSlot,
  OnboardingScreenLayout,
} from '@/src/components/onboarding/onboarding-screen-layout';
import { PaginationDots } from '@/src/components/onboarding/pagination-dots';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { CheckIcon } from '@/src/components/onboarding/ui-icons';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useAppStore } from '@/src/store/app-store';
import { Typography } from '@/src/theme/fonts';

const purpleWords = [
  'our',
  'space',
  'sense',
  'together',
  "we'll",
  'handle',
  'capturing',
  'thoughts',
  'your',
  'best',
  'self',
] as const;

const STEPS: {
  heading: string;
  buttonLabel: string;
  features?: readonly string[];
  mascotVariant?: MascotVariant;
}[] = [
  {
    heading: "Your mind.\nOur space.\nLet's make\nsense together.",
    mascotVariant: 'voice',
    buttonLabel: 'Next',
  },
  {
    heading: "Talk it out.\nWe'll handle\nthe rest.",
    features: [
      'Voice notes & transcription',
      'AI organises your ideas',
      'Tasks, reminders & more',
    ],
    buttonLabel: 'Next',
  },
  {
    heading: "You're not just\ncapturing thoughts,\nyou're building\nyour best self.",
    mascotVariant: 'greet',
    buttonLabel: "Let's Go",
  },
];

export default function OnboardingScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const colors = useBobbleColors();
  const [step, setStep] = useState(0);
  const setHasOnboarded = useAppStore((s) => s.setHasOnboarded);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const scrollToStep = (nextStep: number) => {
    scrollRef.current?.scrollTo({ x: nextStep * width, animated: true });
    setStep(nextStep);
  };

  const handleNext = () => {
    if (isLast) {
      setHasOnboarded(true);
      router.push('/(auth)/sign-in' as Href);
      return;
    }
    scrollToStep(step + 1);
  };

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextStep = Math.round(event.nativeEvent.contentOffset.x / width);
    setStep(Math.max(0, Math.min(STEPS.length - 1, nextStep)));
  };

  return (
    <OnboardingScreenLayout
      footer={
        <>
          <PrimaryButton label={current.buttonLabel} onPress={handleNext} />
          <PaginationDots total={STEPS.length} activeIndex={step} />
        </>
      }
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        bounces={false}
      >
        {STEPS.map((item, stepIndex) => (
          <View key={item.heading} style={[styles.slide, { width }]}>
            <WordAccentHeading
              text={item.heading}
              accentWords={purpleWords}
              style={styles.headingWrap}
              textStyle={styles.heading}
              skipAccent={(word) => stepIndex === 0 && word === 'your'}
            />

            {item.features ? (
              <OnboardingHeroSlot>
                <View style={styles.featureList}>
                  {item.features.map((feature) => (
                    <View key={feature} style={styles.featureRow}>
                      <View style={[styles.featureIcon, { backgroundColor: colors.success }]}>
                        <CheckIcon size={20} strokeWidth={3.5} color={colors.textOnPrimary} />
                      </View>
                      <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </OnboardingHeroSlot>
            ) : item.mascotVariant ? (
              <OnboardingHeroSlot>
                <BobbleMascot variant={item.mascotVariant} size={ONBOARDING_MASCOT_SIZE} />
              </OnboardingHeroSlot>
            ) : null}
          </View>
        ))}
      </ScrollView>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
  },
  headingWrap: {
    width: '90%',
    alignSelf: 'center',
  },
  heading: {
    marginTop: 0,
  },
  featureList: {
    gap: 38,
    width: '90%',
    alignSelf: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    width: '90%',
    alignSelf: 'center',
  },
  featureText: {
    ...Typography.heading,
    fontSize: 22,
    width: '60%',
    lineHeight: 30,
  },
  featureIcon: {
    borderRadius: 120,
    padding: 8,
  },
});
