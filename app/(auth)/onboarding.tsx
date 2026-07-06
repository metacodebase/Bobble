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

import { LineAccentHeading } from '@/src/components/onboarding/accent-heading';
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

const STEPS: {
  heading: string;
  buttonLabel: string;
  features?: readonly string[];
  mascotVariant?: MascotVariant;
}[] = [
  {
    heading: "Your Thoughts.\nYour space.\nSpeak your mind\nLet Bobble give it Grace",
    mascotVariant: 'voice',
    buttonLabel: 'Next',
  },
  {
    heading: "For those Busy doing LIFE!\nTell us what you need to say.\nWe'll handle the rest.",
    features: [
      'Voice notes & transcription for smooth & fast brain dumps.',
      'AI organises your ideas & thoughts to help clear the mind',
      'Tasks, reminders & more to help you focus on the moments, & come back to notes later.',
    ],
    buttonLabel: 'Next',
  },
  {
    heading:
      "You're not just\ncapturing thoughts,\nyou're building\nyour best self.\nbecome efficient.",
    mascotVariant: 'greet',
    buttonLabel: "Let's Go",
  },
];

function OnboardingHeading({
  stepIndex,
  heading,
  style,
  textStyle,
}: {
  stepIndex: number;
  heading: string;
  style?: object;
  textStyle?: object;
}) {
  const colors = useBobbleColors();
  const lines = heading.split('\n');

  if (stepIndex === 1) {
    return (
      <View style={[{ marginTop: 24 }, style]}>
        <Text style={[Typography.heading, textStyle]}>
          <Text style={{ color: colors.text }}>For those Busy doing </Text>
          <Text style={{ color: colors.textAccent }}>LIFE!</Text>
          {'\n'}
          <Text style={{ color: colors.text }}>Tell us what you need to say. </Text>
          {/* {'\n'} */}
          <Text style={{ color: colors.textAccent }}>We&apos;ll handle the rest.</Text>
        </Text>
      </View>
    );
  }

  return (
    <LineAccentHeading lines={lines} style={style} textStyle={textStyle} />
  );
}

export default function OnboardingScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const colors = useBobbleColors();
  const [step, setStep] = useState(0);
  const setHasOnboarded = useAppStore((s) => s.setHasOnboarded);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  // While a button-triggered animated scroll is running, `onScroll` fires with
  // the stale (pre-animation) offset first, which would round back to the old
  // step and make the dots jerk backward. Ignore offset-driven syncing until we
  // land on the target slide (or the user starts a manual drag).
  const programmaticTarget = useRef<number | null>(null);

  const syncStepFromOffset = (offsetX: number) => {
    const nextStep = Math.max(0, Math.min(STEPS.length - 1, Math.round(offsetX / width)));

    if (programmaticTarget.current !== null) {
      if (nextStep === programmaticTarget.current) {
        programmaticTarget.current = null;
      }
      return;
    }

    setStep((prev) => (prev === nextStep ? prev : nextStep));
  };

  const scrollToStep = (nextStep: number) => {
    programmaticTarget.current = nextStep;
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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    syncStepFromOffset(event.nativeEvent.contentOffset.x);
  };

  const handleScrollBeginDrag = () => {
    // A manual swipe always takes over from any in-flight programmatic scroll.
    programmaticTarget.current = null;
  };

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    syncStepFromOffset(event.nativeEvent.contentOffset.x);
  };

  const shouldPlayMascotAnimation = (activeStep: number, slideIndex: number) => {
    if (activeStep === slideIndex) {
      return true;
    }

    // Last mascot slide: start animating one step early so the webp is
    // already playing before the user swipes onto it (avoids static→animated flicker).
    const isLastSlide = slideIndex === STEPS.length - 1;
    return isLastSlide && STEPS[slideIndex].mascotVariant != null && activeStep === slideIndex - 1;
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
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={handleMomentumEnd}
        bounces={false}
      >
        {STEPS.map((item, stepIndex) => (
          <View key={item.heading} style={[styles.slide, { width }]}>
            <OnboardingHeading
              stepIndex={stepIndex}
              heading={item.heading}
              style={styles.headingWrap}
              textStyle={styles.heading}
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
                <BobbleMascot
                  variant={item.mascotVariant}
                  size={ONBOARDING_MASCOT_SIZE}
                  playAnimation={shouldPlayMascotAnimation(step, stepIndex)}
                />
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
    zIndex:100
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
    flex: 1,
    lineHeight: 30,
  },
  featureIcon: {
    borderRadius: 120,
    padding: 8,
  },
});
