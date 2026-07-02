import { Href, router, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { CalendarProviderIcon } from '@/src/components/create-account/calendar-brand-icons';
import { CalendarRow } from '@/src/components/create-account/calendar-row';
import { CreateAccountHeader } from '@/src/components/create-account/create-account-header';
import { DatePickerModal } from '@/src/components/create-account/date-picker-modal';
import { GoalCard } from '@/src/components/create-account/goal-card';
import { LabeledTextInput } from '@/src/components/create-account/labeled-text-input';
import { PhoneInput } from '@/src/components/create-account/phone-input';
import { PickerModal } from '@/src/components/create-account/picker-modal';
import { ProfileAvatar } from '@/src/components/create-account/profile-avatar';
import { SelectField } from '@/src/components/create-account/select-field';
import { TextLinkButton } from '@/src/components/create-account/text-link-button';
import { AccentText } from '@/src/components/onboarding/accent-heading';
import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { GoalIconId } from '@/src/components/onboarding/ui-icons';
import { DEFAULT_COUNTRY, type Country } from '@/src/data/countries';
import { DEFAULT_TIME_ZONE, TIME_ZONES } from '@/src/data/timezones';

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
          Connect your Calendars{'\n'}
          <AccentText>Sync to never Miss What Matters</AccentText>
        </CreateAccountHeader>
      );
    default:
      return null;
  }
}

function formatDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function CreateAccountScreen() {
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('steven@example.com');
  const [phone, setPhone] = useState('987 654 3210');
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [dob, setDob] = useState<Date | null>(new Date(1995, 4, 12));
  const [timeZoneId, setTimeZoneId] = useState<string>(DEFAULT_TIME_ZONE.id);
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set(['productive']));
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timeZonePickerVisible, setTimeZonePickerVisible] = useState(false);

  const navigation = useNavigation();
  const timeZone = TIME_ZONES.find((tz) => tz.id === timeZoneId) ?? DEFAULT_TIME_ZONE;

  const isLast = step === 4;
  const hasPreviousStep = step > 0;

  const goToPreviousStep = useCallback(() => {
    setStep((prev) => Math.max(0, prev - 1));
  }, []);

  // Disable the native pop gesture while on a later step so swiping never
  // reveals/pops back to the sign-in screen. We drive the "back a step"
  // behaviour ourselves via the pan gesture below. On the first step the
  // native gesture is restored so it can leave the screen normally.
  useEffect(() => {
    navigation.setOptions({ gestureEnabled: !hasPreviousStep });
  }, [navigation, hasPreviousStep]);

  // Intercept only *back* actions (Android hardware back / pop) so they step
  // backwards instead of leaving the screen. Programmatic navigation such as
  // router.replace when finishing dispatches a different action type and is
  // deliberately allowed through, otherwise finishing would be blocked and
  // bounce the user back a step.
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      const actionType = event.data.action?.type;
      const isBackAction =
        actionType === 'GO_BACK' ||
        actionType === 'POP' ||
        actionType === 'POP_TO_TOP';
      if (!isBackAction || !hasPreviousStep) return;
      event.preventDefault();
      goToPreviousStep();
    });
    return unsubscribe;
  }, [navigation, hasPreviousStep, goToPreviousStep]);

  // Custom left-edge swipe that moves back a single step without the native
  // pop animation. Only active when there is a previous step; horizontal
  // intent is required so vertical scrolling keeps working.
  const swipeBackGesture = Gesture.Pan()
    .enabled(hasPreviousStep)
    .activeOffsetX(24)
    .failOffsetY([-12, 12])
    .runOnJS(true)
    .onEnd((event) => {
      if (event.translationX > 70 && event.velocityX >= 0) {
        goToPreviousStep();
      }
    });

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
            <ProfileAvatar />
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
              <PhoneInput
                value={phone}
                onChangeText={setPhone}
                country={country}
                onChangeCountry={setCountry}
              />
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
                value={dob ? formatDate(dob) : 'Select date'}
                icon="calendar"
                onPress={() => setDatePickerVisible(true)}
              />
              <SelectField
                label="Time Zone"
                value={timeZone.label}
                icon="chevron"
                onPress={() => setTimeZonePickerVisible(true)}
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
      <GestureDetector gesture={swipeBackGesture}>
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
      </GestureDetector>

      <DatePickerModal
        visible={datePickerVisible}
        value={dob}
        onSelect={setDob}
        onClose={() => setDatePickerVisible(false)}
      />

      <PickerModal
        visible={timeZonePickerVisible}
        title="Select time zone"
        searchPlaceholder="Search time zone"
        selectedId={timeZoneId}
        options={TIME_ZONES.map((tz) => ({ id: tz.id, label: tz.label }))}
        onSelect={(id) => {
          setTimeZoneId(id);
          setTimeZonePickerVisible(false);
        }}
        onClose={() => setTimeZonePickerVisible(false)}
      />
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
