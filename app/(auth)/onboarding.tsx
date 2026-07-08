import { Href, router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { BobbleMascot, getFeaturesMascotWidth, MascotVariant } from '@/src/components/onboarding/bobble-mascot';
import {
  OnboardingHeroSlot,
  OnboardingScreenLayout,
} from '@/src/components/onboarding/onboarding-screen-layout';
import { PaginationDots } from '@/src/components/onboarding/pagination-dots';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { CheckIcon } from '@/src/components/onboarding/ui-icons';
import { useBobbleColors } from '@/src/hooks/use-bobble-colors';
import { useAppStore } from '@/src/store/app-store';
import { Typography } from '@/src/theme/fonts';

const FEATURE_CHECK_BG = '#C8F5D4';
const ONBOARDING_TITLE_COLOR = '#2E2A87';

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
  const { width, height } = useWindowDimensions();
  const referenceWidth = Platform.OS === 'android' ? 412 : 390;
  const referenceHeight = Platform.OS === 'android' ? 915 : 844;
  const scale = Math.min(width / referenceWidth, height / referenceHeight);
  const headingFontSize = Math.round(28 * scale);
  const headingLineHeight = headingFontSize + Math.round(5 * scale);
  const headingSubtitleMarginTop = Math.round(10 * scale);

  if (stepIndex === 0) {
    return (
      <View style={styles.headingWrap}>
        <Text style={[Typography.heading, styles.heading, { fontSize: headingFontSize, lineHeight: headingLineHeight }]}>
          <Text style={{ color: ONBOARDING_TITLE_COLOR }}>Your thoughts.{'\n'}</Text>
          <Text style={{ color: colors.textAccent }}>Your space.</Text>
        </Text>
        <Text
          style={[
            Typography.heading,
            styles.heading,
            styles.headingSubtitle,
            { fontSize: headingFontSize, lineHeight: headingLineHeight, marginTop: headingSubtitleMarginTop },
          ]}
        >
          <Text style={{ color: ONBOARDING_TITLE_COLOR }}>Speak your mind and{'\n'}</Text>
          <Text style={{ color: ONBOARDING_TITLE_COLOR }}>let </Text>
          <Text style={{ color: colors.textAccent }}>Bobble</Text>
          <Text style={{ color: ONBOARDING_TITLE_COLOR }}> give it grace.</Text>
        </Text>
      </View>
    );
  }

  if (stepIndex === 1) {
    return (
      <View style={styles.headingWrap}>
        <Text style={[Typography.heading, styles.heading, { fontSize: headingFontSize, lineHeight: headingLineHeight }]}>
          <Text style={{ color: colors.text }}>Tell us what you need{'\n'}</Text>
          <Text style={{ color: colors.text }}>to say. </Text>
          <Text style={{ color: colors.textAccent }}>We&apos;ll handle{'\n'}</Text>
          <Text style={{ color: colors.textAccent }}>the rest.</Text>
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.headingWrap}>
      <Text style={[Typography.heading, styles.heading, { fontSize: headingFontSize, lineHeight: headingLineHeight }]}>
        <Text style={{ color: colors.text }}>You&apos;re not just{'\n'}</Text>
        <Text style={{ color: colors.textAccent }}>capturing thoughts,{'\n'}</Text>
        <Text style={{ color: colors.text }}>you&apos;re helping build{'\n'}</Text>
        <Text style={{ color: colors.textAccent }}>your best self.</Text>
      </Text>
    </View>
  );
}

export default function OnboardingScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { width, height } = useWindowDimensions();
  const colors = useBobbleColors();
  const [step, setStep] = useState(0);
  const setHasOnboarded = useAppStore((s) => s.setHasOnboarded);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const referenceWidth = Platform.OS === 'android' ? 412 : 390;
  const referenceHeight = Platform.OS === 'android' ? 915 : 844;
  const scale = Math.min(width / referenceWidth, height / referenceHeight);
  const headingTopSpacing = Math.round(16 * scale);
  const heroMascotSize = Math.round(width * 0.62);
  const featuresMascotMaxHeight = Math.min(320, Math.round(height * 0.33));
  const featuresMascotWidth = getFeaturesMascotWidth(featuresMascotMaxHeight);
  const heroPaddingTop = Math.round(16 * scale);

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
        <View style={styles.footerStack}>
          <PrimaryButton label={current.buttonLabel} onPress={handleNext} />
          <View style={styles.dotsOverlay}>
            <PaginationDots total={STEPS.length} activeIndex={step} />
          </View>
        </View>
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
            <View style={[styles.headingContainer, { marginTop: headingTopSpacing }]}>
              <OnboardingHeading stepIndex={stepIndex} />
            </View>

            {item.features ? (
              <View style={styles.featuresSlide}>
                {item.mascotVariant ? (
                  <View style={[styles.mascotSlot, { maxHeight: featuresMascotMaxHeight }]}>
                    <BobbleMascot
                      variant={item.mascotVariant}
                      size={featuresMascotWidth}
                      playAnimation={shouldPlayMascotAnimation(step, stepIndex)}
                    />
                  </View>
                ) : null}
                <View style={styles.featureList}>
                  {item.features.map((feature) => (
                    <View key={feature} style={styles.featureRow}>
                      <View style={[styles.featureIcon, { backgroundColor: FEATURE_CHECK_BG }]}>
                        <CheckIcon size={18} strokeWidth={3.5} color={colors.success} />
                      </View>
                      <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : item.mascotVariant ? (
              <OnboardingHeroSlot style={{ paddingTop: heroPaddingTop, minHeight: heroMascotSize }}>
                <BobbleMascot
                  variant={item.mascotVariant}
                  size={heroMascotSize}
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
  headingContainer: {
    width: '100%',
  },
  headingWrap: {
    width: '90%',
    alignSelf: 'center',
    zIndex: 100,
  },
  heading: {
    textAlign: 'left',
  },
  headingSubtitle: {
  },
  featuresSlide: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
    gap: 12,
  },
  mascotSlot: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
    marginBottom: 4,
  },
  featureList: {
    flexShrink: 0,
    gap: 20,
    width: '100%',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    width: '100%',
  },
  featureText: {
    ...Typography.body,
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  featureIcon: {
    borderRadius: 120,
    padding: 7,
    marginTop: 1,
  },
  footerStack: {
    width: '100%',
    position: 'relative',
  },
  dotsOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '100%',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
