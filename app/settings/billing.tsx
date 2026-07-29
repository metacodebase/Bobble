import { Href, router } from 'expo-router';
import { Linking, Platform } from 'react-native';

import { SettingsLinkRow } from '@/src/components/settings/settings-link-row';
import {
  SettingsDescription,
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import { useIsPro, usePlanLabel, useSubscription } from '@/src/hooks/use-subscription';
import { toast } from '@/src/utils/toast';

function formatExpiry(expiresAt?: string): string | undefined {
  if (!expiresAt) return undefined;
  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

async function openManageSubscriptions() {
  const url =
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/account/subscriptions'
      : 'https://play.google.com/store/account/subscriptions?package=com.bobble.au';
  try {
    await Linking.openURL(url);
  } catch {
    toast.error('Could not open subscription settings');
  }
}

export default function BillingScreen() {
  const isPro = useIsPro();
  const planLabel = usePlanLabel();
  const subscription = useSubscription();
  const expiry = formatExpiry(subscription.expiresAt);

  const statusValue = (() => {
    if (!isPro) return 'Free';
    if (subscription.status === 'trialing') return 'Trial';
    if (subscription.status === 'canceled') return 'Canceling';
    if (subscription.status === 'billing_issue') return 'Billing issue';
    return 'Active';
  })();

  return (
    <SettingsScreenLayout title="Billing">
      <SettingsDescription>Manage your subscription and payment methods.</SettingsDescription>

      <SettingsSection title="Subscription">
        {isPro ? (
          <SettingsLinkRow label="Current plan" value={planLabel} />
        ) : (
          <SettingsLinkRow
            label="Upgrade to Bobble Pro"
            onPress={() => router.push('/paywall' as Href)}
          />
        )}
        <SettingsLinkRow label="Status" value={statusValue} />
        {isPro && expiry ? (
          <SettingsLinkRow
            label={subscription.willRenew === false ? 'Access until' : 'Renews'}
            value={expiry}
          />
        ) : null}
        <SettingsLinkRow
          label={isPro ? 'Manage subscription' : 'Payment method'}
          onPress={isPro ? () => void openManageSubscriptions() : undefined}
          isLast
        />
      </SettingsSection>
    </SettingsScreenLayout>
  );
}
