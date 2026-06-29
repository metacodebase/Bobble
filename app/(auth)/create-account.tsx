import { Href, router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { CalendarProviderIcon } from '@/src/components/create-account/calendar-brand-icons';
import { CalendarRow } from '@/src/components/create-account/calendar-row';
import { CreateAccountHeader } from '@/src/components/create-account/create-account-header';
import { GoalCard } from '@/src/components/create-account/goal-card';
import { LabeledTextInput } from '@/src/components/create-account/labeled-text-input';
import { PhoneInput } from '@/src/components/create-account/phone-input';
import { ProfileAvatar } from '@/src/components/create-account/profile-avatar';
import { SelectField } from '@/src/components/create-account/select-field';
import { TextLinkButton } from '@/src/components/create-account/text-link-button';
import { AccentText } from '@/src/components/onboarding/accent-heading';
import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { GoalIconId } from '@/src/components/onboarding/ui-icons';

const GOALS: { id: GoalIconId; label: string }[] = [
  { id: 'productive', label: 'Be more productive' },
  { id: 'stress', label: 'Reduce stress' },
  { id: 'organised', label: 'Stay organised' },
  { id: 'growth', label: 'Personal growth' },
];

const CALENDARS = [
  { id: 'google', name: 'Google Calendar', provider: 'google' as const },
  { id: 'apple', name: 'Apple Calendar', provider: 'apple' as const },
  { id: 'outlook', name: 'Outlook Calendar', provider: 'outlook' as const },
] as const;

function StepHeading({ step }: { step: number }) {
  switch (step) {
    case 0:
      return (
        <CreateAccountHeader>
          Create your account{'\n'}
          <AccentText>Let&apos;s get to know you</AccentText>
        </CreateAccountHeader>
      );
    case 1:
      return (
        <CreateAccountHeader>
          Create your account{'\n'}
          <AccentText>Almost there!</AccentText>
        </CreateAccountHeader>
      );
    case 2:
      return (
        <CreateAccountHeader>
          Create your account{'\n'}
          <AccentText>Tell us a bit more</AccentText>
        </CreateAccountHeader>
      );
    case 3:
      return (
        <CreateAccountHeader>
          Choose your goals{'\n'}
          <AccentText>What&apos;s most important to you?</AccentText>
        </CreateAccountHeader>
      );
    case 4:
      return (
        <CreateAccountHeader>
          Connect your{'\n'}
          <AccentText>calendars</AccentText>
          {'\n'}
          Sync to never miss what matters
        </CreateAccountHeader>
      );
    default:
      return null;
  }
}

export default function CreateAccountScreen() {
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('steven@example.com');
  const [phone, setPhone] = useState('987 654 3210');
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set(['productive']));

  const isLast = step === 4;

  const handleContinue = () => {
    if (isLast) return;
    setStep((prev) => prev + 1);
  };

  const handleFinish = () => {
    router.replace('/(tabs)' as Href);
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <StepHeading step={0} />
            <ProfileAvatar mascotVariant="main" />
            <LabeledTextInput
              label="Full Name"
              placeholder="Enter your name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </>
        );
      case 1:
        return (
          <>
            <StepHeading step={1} />
            <View style={styles.formGroup}>
              <LabeledTextInput
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <PhoneInput value={phone} onChangeText={setPhone} />
            </View>
          </>
        );
      case 2:
        return (
          <>
            <StepHeading step={2} />
            <View style={styles.formGroup}>
              <SelectField
                label="Date of Birth"
                value="12 May 1995"
                icon="calendar"
              />
              <SelectField
                label="Time Zone"
                value="(GMT+5:30) India Standard Time"
                icon="chevron"
              />
            </View>
          </>
        );
      case 3:
        return (
          <>
            <StepHeading step={3} />
            <View style={styles.goalList}>
              {GOALS.map((goal) => (
                <GoalCard
                  key={goal.id}
                  label={goal.label}
                  iconId={goal.id}
                  selected={selectedGoals.has(goal.id)}
                  onPress={() => toggleGoal(goal.id)}
                />
              ))}
            </View>
          </>
        );
      case 4:
        return (
          <>
            <StepHeading step={4} />
            <View style={styles.calendarList}>
              {CALENDARS.map((calendar) => (
                <CalendarRow
                  key={calendar.id}
                  name={calendar.name}
                  icon={<CalendarProviderIcon provider={calendar.provider} />}
                />
              ))}
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <OnboardingScreenLayout
      footer={
        isLast ? (
          <TextLinkButton label="Skip for now" onPress={handleFinish} />
        ) : (
          <PrimaryButton label="Continue" onPress={handleContinue} />
        )
      }
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderStep()}
        </ScrollView>
      </KeyboardAvoidingView>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
    width: '90%',
    alignSelf: 'center',
  },
  formGroup: {
    marginTop: 32,
    gap: 20,
  },
  goalList: {
    marginTop: 28,
    gap: 14,
  },
  calendarList: {
    marginTop: 28,
  },
});
