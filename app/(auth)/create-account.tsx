import { useNavigation } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { TermsAcceptance } from '@/src/components/create-account/terms-acceptance';
import { AccentText } from '@/src/components/onboarding/accent-heading';
import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { GoalIconId } from '@/src/components/onboarding/ui-icons';
import { isDemoMode } from '@/src/config/backend';
import { COUNTRIES, DEFAULT_COUNTRY, type Country } from '@/src/data/countries';
import { PROFILE_USER } from '@/src/data/demo-data';
import { getDeviceTimeZone, TIME_ZONES } from '@/src/data/timezones';
import {
  useLogin,
  useRegister,
  useRequestSignupVerification,
  useVerifySignupEmail,
} from '@/src/hooks/api';
import { useAppStore } from '@/src/store/app-store';
import {
  clearSignupDraft,
  loadSignupDraft,
  saveSignupDraft,
  type SignupDraft,
} from '@/src/services/signup-draft';
import { BobbleColors } from '@/src/theme/colors';
import { FontFamily } from '@/src/theme/fonts';
import { toast } from '@/src/utils/toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEVICE_TIME_ZONE = getDeviceTimeZone();

function formatDate(date: Date): string {
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

const GOALS: { id: GoalIconId; label: string }[] = [
  { id: 'productive', label: 'Be more productive' },
  { id: 'stress', label: 'Reduce stress' },
  { id: 'organised', label: 'Stay organised' },
  { id: 'growth', label: 'Personal growth' },
  { id: 'efficient', label: 'Become efficient' },
  { id: 'unwind', label: 'Unwind my mind' },
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
          Check your inbox{'\n'}
          <AccentText>Verify your email</AccentText>
        </CreateAccountHeader>
      );
    case 2:
      return (
        <CreateAccountHeader>
          Create your account{'\n'}
          <AccentText>Almost there!</AccentText>
        </CreateAccountHeader>
      );
    case 3:
      return (
        <CreateAccountHeader>
          Create your account{'\n'}
          <AccentText>Tell us a bit more</AccentText>
        </CreateAccountHeader>
      );
    case 4:
      return (
        <CreateAccountHeader>
          Choose your goals{'\n'}
          <AccentText>What&apos;s most important to you?</AccentText>
        </CreateAccountHeader>
      );
    case 5:
      return (
        <CreateAccountHeader>
          Connect your{' '}
          <Text style={{ fontFamily: FontFamily.bold, color: BobbleColors.primary }}>
            Calendars
          </Text>
          {'\n'}
          <AccentText textStyle={{ fontFamily: FontFamily.bold, color: BobbleColors.text }}>
            Sync to never Miss What Matters
          </AccentText>
        </CreateAccountHeader>
      );
    default:
      return null;
  }
}

export default function CreateAccountScreen() {
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [emailVerificationToken, setEmailVerificationToken] = useState('');
  const [verificationExpiresAt, setVerificationExpiresAt] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [dob, setDob] = useState<Date | null>(null);
  const [timeZoneId, setTimeZoneId] = useState<string>(DEVICE_TIME_ZONE.id);
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set(['productive']));
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [timeZonePickerVisible, setTimeZonePickerVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [savedDraft, setSavedDraft] = useState<SignupDraft | null>(null);
  const restoredDraft = useRef(false);

  const navigation = useNavigation();
  const register = useRegister();
  const login = useLogin();
  const requestVerification = useRequestSignupVerification();
  const verifySignupEmail = useVerifySignupEmail();
  const submitting =
    register.isPending ||
    login.isPending ||
    requestVerification.isPending ||
    verifySignupEmail.isPending;
  const timeZone = TIME_ZONES.find((tz) => tz.id === timeZoneId) ?? DEVICE_TIME_ZONE;

  const isLast = step === 5;
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

  useEffect(() => {
    void loadSignupDraft().then(setSavedDraft);
  }, []);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((current) => Math.max(0, current - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Intercept only *back* actions (Android hardware back / pop) so they step
  // backwards instead of leaving the screen. Programmatic navigation such as
  // router.replace when finishing dispatches a different action type and is
  // deliberately allowed through, otherwise finishing would be blocked and
  // bounce the user back a step.
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      const actionType = event.data.action?.type;
      const isBackAction =
        actionType === 'GO_BACK' || actionType === 'POP' || actionType === 'POP_TO_TOP';
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

  const persistDraft = async (
    nextStep: number,
    verification?: { token: string; expiresAt: string }
  ) => {
    await saveSignupDraft({
      step: nextStep,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone,
      countryCode: country.code,
      dobIso: dob?.toISOString() ?? '',
      timeZoneId,
      selectedGoals: [...selectedGoals],
      acceptedTerms,
      emailVerificationToken: verification?.token ?? (emailVerificationToken || undefined),
      verificationExpiresAt: verification?.expiresAt ?? (verificationExpiresAt || undefined),
    });
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (restoredDraft.current || !savedDraft) return;
    if (value.trim().toLowerCase() !== savedDraft.email.trim().toLowerCase()) return;

    restoredDraft.current = true;
    const savedCountry = COUNTRIES.find((item) => item.code === savedDraft.countryCode);
    const tokenIsValid =
      !!savedDraft.emailVerificationToken &&
      !!savedDraft.verificationExpiresAt &&
      new Date(savedDraft.verificationExpiresAt).getTime() > Date.now();
    setFullName(savedDraft.fullName);
    setEmail(savedDraft.email);
    setPhone(savedDraft.phone);
    if (savedCountry) setCountry(savedCountry);
    setDob(savedDraft.dobIso ? new Date(savedDraft.dobIso) : null);
    setTimeZoneId(savedDraft.timeZoneId);
    setSelectedGoals(new Set(savedDraft.selectedGoals));
    setAcceptedTerms(savedDraft.acceptedTerms);
    setEmailVerificationToken(tokenIsValid ? savedDraft.emailVerificationToken! : '');
    setVerificationExpiresAt(tokenIsValid ? savedDraft.verificationExpiresAt! : '');
    setStep(tokenIsValid ? Math.max(2, savedDraft.step) : 1);
    toast.success('Your signup progress has been restored');
  };

  // Validate the current step's inputs before advancing. Returns false (and
  // surfaces a toast) when the step is incomplete. Skipped in demo mode so
  // clients can browse the full onboarding UI without filling every field.
  const validateStep = (current: number): boolean => {
    if (isDemoMode) return true;

    if (current === 0) {
      if (!fullName.trim()) {
        toast.error('Please enter your name');
        return false;
      }
      if (!dob) {
        toast.error('Please select your date of birth');
        return false;
      }
      if (!EMAIL_REGEX.test(email.trim())) {
        toast.error('Please enter a valid email address');
        return false;
      }
      if (!phone.trim()) {
        toast.error('Please enter your phone number');
        return false;
      }
      if (!acceptedTerms && isLast) {
        toast.error('Please accept the Terms & Conditions');
        return false;
      }
    }
    if (current === 1 && verificationCode.length !== 6) {
      toast.error('Please enter the six-digit verification code');
      return false;
    }
    if (current === 2 && password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateStep(step)) return;
    if (isLast) return;
    if (!isDemoMode && step === 0) {
      try {
        const result = await requestVerification.mutateAsync({
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
        });
        setVerificationCode('');
        setEmailVerificationToken('');
        setVerificationExpiresAt('');
        setResendCountdown(result.retryAfterSeconds);
        await persistDraft(1);
      } catch {
        return;
      }
    }
    if (!isDemoMode && step === 1) {
      try {
        const result = await verifySignupEmail.mutateAsync({
          email: email.trim().toLowerCase(),
          code: verificationCode,
        });
        setEmailVerificationToken(result.emailVerificationToken);
        const expiresAt = new Date(
          Date.now() + result.verificationExpiresInSeconds * 1000
        ).toISOString();
        setVerificationExpiresAt(expiresAt);
        await persistDraft(2, {
          token: result.emailVerificationToken,
          expiresAt,
        });
      } catch {
        return;
      }
    }
    const nextStep = step + 1;
    if (!isDemoMode && step >= 2) await persistDraft(nextStep);
    setStep(nextStep);
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0 || requestVerification.isPending) return;
    try {
      const result = await requestVerification.mutateAsync({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
      });
      setVerificationCode('');
      setResendCountdown(result.retryAfterSeconds);
    } catch {
      // Mutation displays the backend error.
    }
  };

  // Email ownership was already verified before the password/onboarding steps.
  const handleFinish = async () => {
    if (submitting) return;

    if (isDemoMode) {
      try {
        const demoEmail = email.trim() || PROFILE_USER.email;
        await login.mutateAsync({
          email: demoEmail,
          password: password || 'demo-password',
        });
        if (fullName.trim()) {
          const currentUser = useAppStore.getState().user;
          if (currentUser) {
            useAppStore.getState().setUser({ ...currentUser, name: fullName.trim() });
          }
        }
      } catch {
        // Errors are already reported via the mutation onError toasts.
      }
      return;
    }

    if (
      !fullName.trim() ||
      !dob ||
      !EMAIL_REGEX.test(email.trim()) ||
      !phone.trim() ||
      password.length < 8 ||
      !emailVerificationToken ||
      !acceptedTerms
    ) {
      toast.error('Please complete all required fields');
      if (
        !fullName.trim() ||
        !dob ||
        !EMAIL_REGEX.test(email.trim()) ||
        !phone.trim() ||
        !acceptedTerms
      ) {
        setStep(0);
      } else {
        setStep(emailVerificationToken ? 2 : 1);
      }
      return;
    }
    try {
      await register.mutateAsync({
        name: fullName.trim(),
        email: email.trim(),
        password,
        emailVerificationToken,
      });
      await clearSignupDraft();
    } catch {
      // Errors are already reported via the mutation onError toasts.
    }
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
            <View style={styles.formGroup}>
              <LabeledTextInput
                label="Full Name"
                placeholder="Enter your name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                returnKeyType="next"
              />
              <SelectField
                label="Date of Birth"
                value={dob ? formatDate(dob) : 'Select date'}
                icon="calendar"
                onPress={() => setDatePickerVisible(true)}
              />
              <LabeledTextInput
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
              />
              <PhoneInput
                value={phone}
                onChangeText={setPhone}
                country={country}
                onChangeCountry={setCountry}
              />
              <SelectField
                label="Country"
                value={`${country.flag} ${country.name}`}
                icon="chevron"
                onPress={() => setCountryPickerVisible(true)}
              />
            </View>
          </>
        );
      case 1:
        return (
          <>
            <StepHeading step={1} />
            <View style={styles.formGroup}>
              <LabeledTextInput
                label="Verification code"
                placeholder="000000"
                value={verificationCode}
                onChangeText={(value) => setVerificationCode(value.replace(/\D/g, '').slice(0, 6))}
                keyboardType="number-pad"
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                maxLength={6}
                autoFocus
                style={styles.otpInput}
              />
              <Text style={styles.verificationHelp}>
                We sent a six-digit code to {email.trim().toLowerCase()}. It expires in 10 minutes.
              </Text>
              <Text
                style={styles.resendLink}
                onPress={() => void handleResendCode()}
                suppressHighlighting
              >
                {resendCountdown > 0
                  ? `Resend code in ${resendCountdown}s`
                  : requestVerification.isPending
                    ? 'Sending…'
                    : 'Resend code'}
              </Text>
            </View>
          </>
        );
      case 2:
        return (
          <>
            <StepHeading step={2} />
            <View style={styles.formGroup}>
              <LabeledTextInput
                label="Password"
                placeholder="At least 8 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                textContentType="newPassword"
              />
            </View>
          </>
        );
      case 3:
        return (
          <>
            <StepHeading step={3} />
            <View style={styles.formGroup}>
              <SelectField
                label="Time Zone"
                value={timeZone.label}
                icon="chevron"
                onPress={() => setTimeZonePickerVisible(true)}
              />
            </View>
          </>
        );
      case 4:
        return (
          <>
            <StepHeading step={4} />
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
      case 5:
        return (
          <>
            <StepHeading step={5} />
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
      contentStyle={styles.content}
      footer={
        <View style={styles.footerGroup}>
          {isLast ? (
            <>
              <TermsAcceptance
                accepted={acceptedTerms}
                onToggle={() => setAcceptedTerms((value) => !value)}
              />
              <PrimaryButton label="Create Account" onPress={handleFinish} loading={submitting} />
              {/* <TextLinkButton label="Skip for now" onPress={handleFinish} /> */}
            </>
          ) : (
            <PrimaryButton
              label={step === 1 ? 'Verify Email' : 'Continue'}
              onPress={() => void handleContinue()}
              loading={requestVerification.isPending || verifySignupEmail.isPending}
            />
          )}
        </View>
      }
    >
      <GestureDetector gesture={swipeBackGesture}>
        <KeyboardAvoidingView style={styles.flex} behavior="padding">
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
        visible={countryPickerVisible}
        title="Select country"
        searchPlaceholder="Search country"
        selectedId={country.code}
        options={COUNTRIES.map((c) => ({
          id: c.code,
          label: c.name,
          leading: <Text style={styles.countryFlag}>{c.flag}</Text>,
        }))}
        onSelect={(id) => {
          const next = COUNTRIES.find((c) => c.code === id);
          if (next) setCountry(next);
          setCountryPickerVisible(false);
        }}
        onClose={() => setCountryPickerVisible(false)}
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
  content: {
    width: '90%',
    alignSelf: 'center',
  },
  flex: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
    width: '100%',
  },
  formGroup: {
    marginTop: 12,
    gap: 20,
    width: '90%',
    alignSelf: 'center',
  },
  otpInput: {
    textAlign: 'center',
    letterSpacing: 10,
  },
  verificationHelp: {
    color: BobbleColors.textSecondary,
    textAlign: 'center',
  },
  resendLink: {
    color: BobbleColors.primary,
    textAlign: 'center',
  },
  goalList: {
    marginTop: 28,
    gap: 14,
    width: '90%',
    alignSelf: 'center',
  },
  calendarList: {
    marginTop: 28,
    width: '90%',
    alignSelf: 'center',
  },
  footerGroup: {
    gap: 12,
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  countryFlag: {
    fontSize: 24,
  },
});
