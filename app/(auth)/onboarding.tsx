import { Href, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
  const [step, setStep] = useState(0);
  const setHasOnboarded = useAppStore((s) => s.setHasOnboarded);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      setHasOnboarded(true);
      router.push('/(auth)/sign-in' as Href);
      return;
    }
    setStep((prev) => prev + 1);
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
      <Text style={styles.heading}>{current.heading}</Text>

      {current.features ? (
        <View style={styles.featureList}>
          {current.features.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name="checkmark" size={24} color={BobbleColors.success} />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      ) : current.mascotVariant ? (
        <View style={styles.mascotContainer}>
          <BobbleMascot variant={current.mascotVariant} size={1000 * 0.4} />
        </View>
      ) : null}
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  heading: {
    ...Typography.heading,
    color: BobbleColors.text,
    marginTop: 24,
  },
  mascotContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureList: {
    flex:1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 100,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    width:'100%',
  },
  featureText: {
    ...Typography.heading,
    color: BobbleColors.text,
    fontSize: 22,
    width:'60%',
  },
  featureIcon: {
    borderRadius: 120,
    backgroundColor: BobbleColors.success+30,
    padding: 8,
  },
});
