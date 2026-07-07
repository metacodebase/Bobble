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

import { BobbleMascot, getFeaturesMascotWidth, MascotVariant } from '@/src/components/onboarding/bobble-mascot';
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

const FEATURES_MASCOT_MAX_HEIGHT = 310;
const FEATURES_SLIDE_MASCOT_WIDTH = getFeaturesMascotWidth(FEATURES_MASCOT_MAX_HEIGHT);

const STEPS: {
  buttonLabel: string;
  features?: readonly string[];
  mascotVariant?: MascotVariant;
}[] = [
    {
      mascotVariant: 'voice',
      buttonLabel: 'Next',
    },
    {
      mascotVariant: 'features',
      features: [
        'Voice notes and transcription for smooth and fast brain dumps.',
        'AI organises your ideas and thoughts to help clear the mind.',
        'Tasks, reminders and more to help you focus on the moments and come back to notes later.',
      ],
      buttonLabel: 'Next',
    },
    {
      mascotVariant: 'greet',
      buttonLabel: "Let's Go",
    },
  ];

function OnboardingHeading({ stepIndex }: { stepIndex: number }) {
  const colors = useBobbleColors();

  if (stepIndex === 0) {
    return (
      <View style={styles.headingWrap}>
        <Text style={[Typography.heading, styles.heading]}>
          <Text style={{ color: colors.text }}>Your thoughts.{'\n'}</Text>
          <Text style={{ color: colors.textAccent }}>Your space.</Text>
        </Text>
        <Text style={[Typography.heading, styles.heading, styles.headingSubtitle]}>
          <Text style={{ color: colors.text }}>Speak your mind and{'\n'}</Text>
          <Text style={{ color: colors.text }}>let </Text>
          <Text style={{ color: colors.textAccent }}>Bobble</Text>
          <Text style={{ color: colors.text }}> give it grace.</Text>
        </Text>
      </View>
    );
  }

  if (stepIndex === 1) {
    return (
      <View style={styles.headingWrap}>
        <Text style={[Typography.heading, styles.heading, { color: colors.text }]}>
          Tell us what you need to say.{' '}
          <Text style={{ color: colors.textAccent }}>We&apos;ll handle the rest.</Text>
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.headingWrap}>
      <Text style={[Typography.heading, styles.heading, { color: colors.text }]}>
        You&apos;re not just capturing thoughts,{' '}
        <Text style={{ color: colors.textAccent }}>you&apos;re helping build your best self.</Text>
      </Text>
    </View>
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
      backgroundImage={step === 0 ? require('@/src/assets/images/background/two.png')
        : step === 1 ? require('@/src/assets/images/background/three.png')
          : require('@/src/assets/images/background/four.png')}
      footer={
        <>
          <PrimaryButton label={current.buttonLabel} onPress={handleNext} />
          <PaginationDots total={STEPS.length} activeIndex={step} />
        </>
      }
    >
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
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
          <View key={stepIndex} style={[styles.slide, { width }]}>
            <OnboardingHeading stepIndex={stepIndex} />

            {item.features ? (
              <View style={styles.featuresSlide}>
                {item.mascotVariant ? (
                  <View style={styles.mascotSlot}>
                    <BobbleMascot
                      variant={item.mascotVariant}
                      size={FEATURES_SLIDE_MASCOT_WIDTH}
                      playAnimation={shouldPlayMascotAnimation(step, stepIndex)}
                    />
                  </View>
                ) : null}
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
              </View>
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
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
  },
  headingWrap: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 8,
    zIndex: 100,
  },
  heading: {
    textAlign: 'left',
  },
  headingSubtitle: {
    marginTop: 16,
  },
  featuresSlide: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
    gap: 16,
  },
  mascotSlot: {
    width: '100%',
    maxHeight: FEATURES_MASCOT_MAX_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  featureList: {
    flexShrink: 0,
    gap: 24,
    width: '100%',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    width: '100%',
  },
  featureText: {
    ...Typography.heading,
    fontSize: 20,
    flex: 1,
    lineHeight: 28,
  },
  featureIcon: {
    borderRadius: 120,
    padding: 8,
  },
});
