import { useEffect } from 'react';
import { Platform } from 'react-native';
import mobileAds, { AdsConsent } from 'react-native-google-mobile-ads';

import { useMe } from '@/src/hooks/api';
import { usePurchasesIdentityReady, useSubscription } from '@/src/hooks/use-subscription';
import { disableAds, setAdsState } from '@/src/services/ads';
import { useAppStore } from '@/src/store/app-store';

async function initializeAds(canContinue: () => boolean) {
  let consentInfo;
  try {
    consentInfo = await AdsConsent.gatherConsent();
  } catch {
    consentInfo = await AdsConsent.getConsentInfo();
  }
  if (!consentInfo.canRequestAds) throw new Error('Consent does not permit ad requests');

  let nonPersonalized = true;
  try {
    const gdprApplies = await AdsConsent.getGdprApplies();
    if (gdprApplies === false) nonPersonalized = false;
    if (gdprApplies === true) {
      const choices = await AdsConsent.getUserChoices();
      nonPersonalized = !(
        choices.storeAndAccessInformationOnDevice && choices.selectPersonalisedAds
      );
    }
  } catch {
    nonPersonalized = true;
  }
  if (!canContinue()) throw new Error('Ad eligibility changed');

  await mobileAds().setRequestConfiguration({
    tagForChildDirectedTreatment: false,
    tagForUnderAgeOfConsent: false,
  });
  await mobileAds().initialize();
  return nonPersonalized;
}

export function AdsBootstrap() {
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const isGuest = useAppStore((s) => s.isGuest);
  const subscription = useSubscription();
  const purchasesReady = usePurchasesIdentityReady();
  const me = useMe(isAuthenticated);
  const subscriptionKnown = isGuest ? purchasesReady : me.isSuccess && !me.isFetching;
  const eligible =
    hasHydrated &&
    (Platform.OS === 'ios' || Platform.OS === 'android') &&
    (isAuthenticated || isGuest) &&
    subscriptionKnown &&
    !subscription.isPro;

  useEffect(() => {
    if (!eligible) {
      disableAds();
      return;
    }

    let cancelled = false;
    setAdsState({
      canRequestAds: false,
      requestNonPersonalizedAdsOnly: true,
      status: 'checking-consent',
    });
    void initializeAds(() => !cancelled)
      .then((requestNonPersonalizedAdsOnly) => {
        if (!cancelled) {
          setAdsState({ canRequestAds: true, requestNonPersonalizedAdsOnly, status: 'ready' });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAdsState({
            canRequestAds: false,
            requestNonPersonalizedAdsOnly: true,
            status: 'error',
          });
        }
      });

    return () => {
      cancelled = true;
      disableAds();
    };
  }, [eligible]);

  return null;
}
