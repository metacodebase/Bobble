import { Href, router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Brain, Calendar, Leaf, TrendingUp } from 'lucide-react-native';

import { CalendarRow } from '@/src/components/create-account/calendar-row';
import { OutlookIcon } from '@/src/components/create-account/calendar-brand-icons';
import { CreateAccountHeader } from '@/src/components/create-account/create-account-header';
import { GoalCard } from '@/src/components/create-account/goal-card';
import { LabeledTextInput } from '@/src/components/create-account/labeled-text-input';
import { PhoneInput } from '@/src/components/create-account/phone-input';
import { ProfileAvatar } from '@/src/components/create-account/profile-avatar';
import { SelectField } from '@/src/components/create-account/select-field';
import { TextLinkButton } from '@/src/components/create-account/text-link-button';
import { OnboardingScreenLayout } from '@/src/components/onboarding/onboarding-screen-layout';
import { PrimaryButton } from '@/src/components/onboarding/primary-button';
import { AppleIcon, GoogleIcon } from '@/src/components/onboarding/social-icons';
import { toast } from '@/src/utils/toast';

const GOALS = [
  { id: 'productive', label: 'Be more productive', icon: TrendingUp },
  { id: 'stress', label: 'Reduce stress', icon: Leaf },
  { id: 'organised', label: 'Stay organised', icon: Calendar },
  { id: 'growth', label: 'Personal growth', icon: Brain },
] as const;

const CALENDARS = [
  { id: 'google', name: 'Google Calendar', icon: <GoogleIcon size={24} /> },
  { id: 'apple', name: 'Apple Calendar', icon: <AppleIcon size={24} /> },
  { id: 'outlook', name: 'Outlook Calendar', icon: <OutlookIcon size={24} /> },
] as const;

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
    toast.info('Account setup complete');
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
            <CreateAccountHeader title="Create your account" subtitle="Let's get to know you" />
            <ProfileAvatar onPress={() => toast.info('Photo picker coming soon')} />
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
            <CreateAccountHeader title="Create your account" subtitle="Almost there!" />
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
            <CreateAccountHeader title="Create your account" subtitle="Tell us a bit more" />
            <View style={styles.formGroup}>
              <SelectField
                label="Date of Birth"
                value="12 May 1995"
                icon="calendar"
                onPress={() => toast.info('Date picker coming soon')}
              />
              <SelectField
                label="Time Zone"
                value="(GMT+5:30) India Standard Time"
                icon="chevron"
                onPress={() => toast.info('Time zone picker coming soon')}
              />
            </View>
          </>
        );
      case 3:
        return (
          <>
            <CreateAccountHeader title="Choose your goals" subtitle="What's most important to you?" />
            <View style={styles.goalList}>
              {GOALS.map((goal) => (
                <GoalCard
                  key={goal.id}
                  label={goal.label}
                  icon={goal.icon}
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
            <CreateAccountHeader
              title="Connect your calendars"
              subtitle="Sync to never miss what matters"
            />
            <View style={styles.calendarList}>
              {CALENDARS.map((calendar) => (
                <CalendarRow
                  key={calendar.id}
                  name={calendar.name}
                  icon={calendar.icon}
                  onConnect={() => toast.info(`${calendar.name} connection coming soon`)}
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
  },
  formGroup: {
    marginTop: 32,
    gap: 20,
  },
  goalList: {
    marginTop: 28,
    gap: 12,
  },
  calendarList: {
    marginTop: 28,
  },
});
