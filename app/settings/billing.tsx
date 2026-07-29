import { useFocusEffect } from '@react-navigation/native';
import { Href, router } from 'expo-router';
import { useCallback } from 'react';
import { Linking, Platform } from 'react-native';

import { SettingsLinkRow } from '@/src/components/settings/settings-link-row';
import {
  SettingsDescription,
  SettingsScreenLayout,
  SettingsSection,
} from '@/src/components/settings/settings-screen-layout';
import {
  canManageSubscriptionOnDevice,
  crossStoreManageMessage,
  formatSubscriptionExpiry,
  subscriptionStatusLabel,
  subscriptionStoreLabel,
} from '@/src/config/subscription';
import {
  useIsPro,
  usePlanLabel,
  useRefreshSubscription,
  useSubscription,
} from '@/src/hooks/use-subscription';
import { toast } from '@/src/utils/toast';

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
  const refreshSubscription = useRefreshSubscription();
  const expiry = formatSubscriptionExpiry(subscription.expiresAt);
  const storeLabel = subscriptionStoreLabel(subscription.store);
  const statusValue = isPro ? subscriptionStatusLabel(subscription.status) : 'Free';
  const canManage = canManageSubscriptionOnDevice(subscription.store, Platform.OS);
  const renewLabel =
    subscription.willRenew === false
      ? 'Access until'
      : subscription.status === 'trialing'
        ? 'Trial ends'
        : 'Renews';

  useFocusEffect(
    useCallback(() => {
      void refreshSubscription({ pollUntilPro: false, syncFromRevenueCat: true });
    }, [refreshSubscription])
  );

  const handleManagePress = () => {
    if (!canManage) {
      toast.error(crossStoreManageMessage(subscription.store));
      return;
    }
    void openManageSubscriptions();
  };

  return (
    <SettingsScreenLayout title="Billing">
      <SettingsDescription>
        {isPro && !canManage && storeLabel
          ? `Your Pro plan was purchased on ${storeLabel}. Manage billing on that store.`
          : 'Manage your subscription and payment methods.'}
      </SettingsDescription>

      <SettingsSection title="Subscription">
        {isPro ? (
          <>
            <SettingsLinkRow label="Current plan" value={planLabel} />
            <SettingsLinkRow label="Status" value={statusValue} />
            {storeLabel ? <SettingsLinkRow label="Purchased on" value={storeLabel} /> : null}
            {expiry ? <SettingsLinkRow label={renewLabel} value={expiry} /> : null}
            <SettingsLinkRow
              label="View plan details"
              onPress={() => router.push('/paywall' as Href)}
            />
            <SettingsLinkRow
              label={canManage ? 'Manage subscription' : `Manage on ${storeLabel ?? 'other store'}`}
              onPress={handleManagePress}
              isLast
            />
          </>
        ) : (
          <>
            <SettingsLinkRow label="Current plan" value="Free" />
            <SettingsLinkRow label="Status" value={statusValue} />
            <SettingsLinkRow
              label="Upgrade to Bobble Pro"
              onPress={() => router.push('/paywall' as Href)}
              isLast
            />
          </>
        )}
      </SettingsSection>
    </SettingsScreenLayout>
  );
}
