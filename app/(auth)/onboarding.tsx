import { Href, router } from 'expo-router';
import { useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { BobbleMascot, MascotVariant } from '@/src/components/onboarding/bobble-mascot';
import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { PaginationDots } from '@/src/components/onboarding/pagination-dots';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { useAppStore } from '@/src/store/app-store';
import { BobbleColors } from '@/src/theme/colors';
import { Typography } from '@/src/theme/fonts';
import { Ionicons } from '@expo/vector-icons';

const STEPS: {
  heading: string;
  buttonLabel: string;
  features?: readonly string[];
  mascotVariant?: MascotVariant;
}[] = [
    {
      heading: "Your mind. Our space. Let's make sense together.",
      mascotVariant: 'sitting',
      buttonLabel: 'Next',
    },
    {
      heading: "Talk it out. We'll handle the rest.",
      features: [
        'Voice notes & transcription',
        'AI organises your ideas',
        'Tasks, reminders & more',
      ],
      buttonLabel: 'Next',
    },
    {
      heading: "You're not just capturing thoughts, you're building your best self.",
      mascotVariant: 'waving',
      buttonLabel: "Let's Go",
    },
  ];

export default function OnboardingScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
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
        {STEPS.map((item) => (
          <View key={item.heading} style={[styles.slide, { width}]}>
            <Text style={styles.heading}>{item.heading}</Text>

            {item.features ? (
              <View style={styles.featureList}>
                {item.features.map((feature) => (
                  <View key={feature} style={styles.featureRow}>
                    <View style={styles.featureIcon}>
                      <Ionicons name="checkmark" size={24} color={BobbleColors.success} />
                    </View>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            ) : item.mascotVariant ? (
              <View style={styles.mascotContainer}>
                <BobbleMascot variant={item.mascotVariant} size={1000 * 0.4} />
              </View>
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
  heading: {
    ...Typography.heading,
    color: BobbleColors.text,
    marginTop: 24,
    width:'90%',
    alignSelf:'center',
  },
  mascotContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureList: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 100,
    width:'90%',
    alignSelf:'center',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    width: '100%',
  },
  featureText: {
    ...Typography.heading,
    color: BobbleColors.text,
    fontSize: 22,
    width: '60%',
  },
  featureIcon: {
    borderRadius: 120,
    backgroundColor: `${BobbleColors.success}30`,
    padding: 8,
  },
  footer: {
    width:'100%',
    alignSelf:'center',
    paddingHorizontal:28,
  },
});
