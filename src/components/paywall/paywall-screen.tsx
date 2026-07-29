import { Image } from 'expo-image';
import { Href, router } from 'expo-router';
import { X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActiveSubscriptionPanel } from '@/src/components/paywall/active-subscription-panel';
import { FeatureCard } from '@/src/components/paywall/feature-card';
import { PaywallCtaButton } from '@/src/components/paywall/paywall-cta-button';
import { PlanOption } from '@/src/components/paywall/plan-option';
import { useAppBackdrop } from '@/src/components/ui/app-background';
import {
  DEFAULT_PAYWALL_PLAN,
  PAYWALL_FEATURES,
  PAYWALL_PLANS,
  type PaywallPlan,
  type PaywallPlanId,
} from '@/src/data/paywall';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import {
  canManageSubscriptionOnDevice,
  crossStoreManageMessage,
  type SubscriptionStore,
} from '@/src/config/subscription';
import {
  useIsPro,
  usePurchasesIdentityReady,
  useRefreshSubscription,
  useSubscription,
} from '@/src/hooks/use-subscription';
import {
  customerHasPro,
  getOfferings,
  getPurchaseErrorMessage,
  isPurchaseCancelled,
  isPurchasesSupported,
  priceLabelsFromOfferings,
  purchasePlan,
  restorePurchases,
  type StorePriceLabels,
} from '@/src/services/purchases';
import { useAppStore } from '@/src/store/app-store';
import { Typography } from '@/src/theme/fonts';
import { androidSafeBottom, androidSafeTop } from '@/src/utils/safe-padding';
import { toast } from '@/src/utils/toast';

const BUSINESS_MASCOT = require('@/src/assets/images/paywall/bobble-business.png');

const DAY_TITLE = '#2E2A87';
const DAY_SUBTITLE = '#6B5FA8';

type PaywallScreenProps = {
  onClose?: () => void;
};

function withStorePrices(priceLabels: StorePriceLabels): readonly PaywallPlan[] {
  return PAYWALL_PLANS.map((plan) => {
    const priceLabel = priceLabels[plan.id];
    if (!priceLabel) return plan;
    return {
      ...plan,
      priceLabel,
      trialSummary: plan.trialSummary.replace(plan.priceLabel, priceLabel),
    };
  });
}

async function openManageSubscriptions(store?: SubscriptionStore) {
  if (!canManageSubscriptionOnDevice(store, Platform.OS)) {
    toast.error(crossStoreManageMessage(store));
    return;
  }
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

export function PaywallScreen({ onClose }: PaywallScreenProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { source, color: backdropColor } = useAppBackdrop();
  const night = useNightForeground();
  const isPro = useIsPro();
  const subscription = useSubscription();
  const purchasesReady = usePurchasesIdentityReady();
  const refreshSubscription = useRefreshSubscription();
  const userId = useAppStore((s) => s.user?._id ?? null);
  const [selectedPlanId, setSelectedPlanId] = useState<PaywallPlanId>(DEFAULT_PAYWALL_PLAN);
  const [isStartingTrial, setIsStartingTrial] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [priceLabels, setPriceLabels] = useState<StorePriceLabels>({});

  const referenceWidth = Platform.OS === 'android' ? 412 : 390;
  const referenceHeight = Platform.OS === 'android' ? 915 : 844;
  const scale = Math.min(width / referenceWidth, height / referenceHeight);
  const mascotSize = Math.round(148 * scale);

  const titleColor = DAY_TITLE;
  const subtitleColor = DAY_SUBTITLE;
  const closeIconColor = night.text ?? '#2E2A87';
  const closeButtonBg = night.isNight ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.72)';
  const trialBannerBg = 'rgba(159, 82, 242, 0.12)';

  const plans = useMemo(() => withStorePrices(priceLabels), [priceLabels]);
  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? plans[0],
    [plans, selectedPlanId]
  );

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)' as Href);
  };

  useEffect(() => {
    if (!isPurchasesSupported() || !purchasesReady) return;
    let cancelled = false;
    void (async () => {
      const offerings = await getOfferings();
      if (cancelled) return;
      setPriceLabels(priceLabelsFromOfferings(offerings));
    })();
    return () => {
      cancelled = true;
    };
  }, [purchasesReady]);

  const handleStartTrial = async () => {
    if (isStartingTrial || isRestoring) return;
    if (!isPurchasesSupported()) {
      toast.error('Purchases are only available on iOS and Android builds.');
      return;
    }
    if (!userId) {
      toast.error('Sign in to subscribe.');
      return;
    }
    if (!purchasesReady) {
      toast.error('Purchases are still setting up. Try again in a moment.');
      return;
    }

    setIsStartingTrial(true);
    try {
      const { customerInfo } = await purchasePlan(selectedPlanId, userId);
      await refreshSubscription({ pollUntilPro: true });
      if (customerHasPro(customerInfo)) {
        toast.success('Welcome to Bobble Pro!');
      } else {
        toast.success('Purchase complete. Unlocking Pro...');
      }
    } catch (error) {
      if (!isPurchaseCancelled(error)) {
        toast.error(getPurchaseErrorMessage(error, 'Could not start subscription'));
      }
    } finally {
      setIsStartingTrial(false);
    }
  };

  const handleRestore = async () => {
    if (isRestoring || isStartingTrial) return;
    if (!isPurchasesSupported()) {
      toast.error('Purchases are only available on iOS and Android builds.');
      return;
    }
    if (!userId) {
      toast.error('Sign in to restore purchases.');
      return;
    }
    if (!purchasesReady) {
      toast.error('Purchases are still setting up. Try again in a moment.');
      return;
    }

    setIsRestoring(true);
    try {
      const customerInfo = await restorePurchases(userId);
      const user = await refreshSubscription({ pollUntilPro: true });
      if (customerHasPro(customerInfo) || user?.subscription?.isPro) {
        toast.success('Purchases restored. Welcome back to Bobble Pro!');
      } else {
        toast.success('No previous purchases found.');
      }
    } catch (error) {
      toast.error(getPurchaseErrorMessage(error, 'Could not restore purchases'));
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <ImageBackground
      source={source}
      style={[styles.root, { backgroundColor: backdropColor }]}
      resizeMode="cover"
    >
      <Pressable
        onPress={handleClose}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Close paywall"
        style={[
          styles.closeButton,
          {
            top: androidSafeTop(insets.top) + 10,
            backgroundColor: closeButtonBg,
          },
        ]}
      >
        <X size={20} color={closeIconColor} strokeWidth={2.2} />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: androidSafeTop(insets.top) + 8,
            paddingBottom: androidSafeBottom(insets.bottom) + 16,
          },
        ]}
      >
        <View style={styles.hero}>
          <Image
            source={BUSINESS_MASCOT}
            style={{ width: mascotSize, height: mascotSize }}
            contentFit="contain"
          />
        </View>

        {isPro ? (
          <ActiveSubscriptionPanel
            subscription={subscription}
            titleColor={titleColor}
            subtitleColor={subtitleColor}
            bannerBg={trialBannerBg}
            onManage={() => {
              void openManageSubscriptions(subscription.store);
            }}
            onDone={handleClose}
          />
        ) : (
          <>
            <View style={styles.heroCopy}>
              <Text style={[styles.title, { color: titleColor }]}>Unlock Bobble Pro</Text>
              <Text style={[styles.subtitle, { color: subtitleColor }]}>
                More clarity. Less mental clutter.
              </Text>
            </View>

            <View style={styles.features}>
              {PAYWALL_FEATURES.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </View>

            <View style={styles.plans}>
              {plans.map((plan) => (
                <PlanOption
                  key={plan.id}
                  plan={plan}
                  selected={plan.id === selectedPlanId}
                  onPress={() => setSelectedPlanId(plan.id)}
                />
              ))}
            </View>

            <View style={styles.ctaBlock}>
              <PaywallCtaButton
                label={purchasesReady ? 'Start 7-day free trial' : 'Preparing purchases...'}
                onPress={() => {
                  void handleStartTrial();
                }}
                loading={isStartingTrial}
                disabled={isStartingTrial || isRestoring || !purchasesReady}
              />
              <View style={[styles.trialBanner, { backgroundColor: trialBannerBg }]}>
                <Text style={[styles.trialText, { color: titleColor }]}>
                  {selectedPlan.trialSummary}
                </Text>
              </View>
            </View>

            <View style={styles.footerLinks}>
              <Pressable onPress={() => router.push('/settings/terms-and-conditions' as Href)}>
                <Text style={[styles.footerLink, { color: titleColor }]}>Terms</Text>
              </Pressable>
              <Text style={[styles.footerDot, { color: titleColor }]}>{'\u00B7'}</Text>
              <Pressable onPress={() => router.push('/settings/privacy-policy' as Href)}>
                <Text style={[styles.footerLink, { color: titleColor }]}>Privacy</Text>
              </Pressable>
              <Text style={[styles.footerDot, { color: titleColor }]}>{'\u00B7'}</Text>
              <Pressable
                onPress={() => {
                  void handleRestore();
                }}
                disabled={isRestoring || isStartingTrial || !purchasesReady}
              >
                <Text style={[styles.footerLink, { color: titleColor }]}>
                  {isRestoring ? 'Restoring...' : 'Restore'}
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    left: 18,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '90%',
    alignSelf: 'center',
    gap: 16,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 28,
  },
  heroCopy: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    ...Typography.heading,
    fontSize: Platform.OS === 'android' ? 30 : 28,
    lineHeight: Platform.OS === 'android' ? 36 : 34,
    textAlign: 'center',
    marginTop: 2,
  },
  subtitle: {
    ...Typography.subheading,
    fontSize: Platform.OS === 'android' ? 16 : 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  plans: {
    gap: 10,
  },
  ctaBlock: {
    gap: 10,
  },
  trialBanner: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  trialText: {
    ...Typography.caption,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 2,
  },
  footerLink: {
    ...Typography.caption,
    fontSize: 13,
    lineHeight: 18,
  },
  footerDot: {
    ...Typography.caption,
    fontSize: 13,
    lineHeight: 18,
  },
});
