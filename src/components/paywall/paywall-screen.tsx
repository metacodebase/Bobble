import { Image } from 'expo-image';
import { Href, router } from 'expo-router';
import { X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FeatureCard } from '@/src/components/paywall/feature-card';
import { PaywallCtaButton } from '@/src/components/paywall/paywall-cta-button';
import { PlanOption } from '@/src/components/paywall/plan-option';
import { useAppBackdrop } from '@/src/components/ui/app-background';
import {
  DEFAULT_PAYWALL_PLAN,
  PAYWALL_FEATURES,
  PAYWALL_PLANS,
  type PaywallPlanId,
} from '@/src/data/paywall';
import { useNightForeground } from '@/src/hooks/use-night-foreground';
import { Typography } from '@/src/theme/fonts';
import { toast } from '@/src/utils/toast';

const BUSINESS_MASCOT = require('@/src/assets/images/paywall/bobble-business.png');

const DAY_TITLE = '#2E2A87';
const DAY_SUBTITLE = '#6B5FA8';

type PaywallScreenProps = {
  onClose?: () => void;
};

export function PaywallScreen({ onClose }: PaywallScreenProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { source, color: backdropColor } = useAppBackdrop();
  const night = useNightForeground();
  const [selectedPlanId, setSelectedPlanId] = useState<PaywallPlanId>(DEFAULT_PAYWALL_PLAN);
  const [isStartingTrial, setIsStartingTrial] = useState(false);

  const referenceWidth = Platform.OS === 'android' ? 412 : 390;
  const referenceHeight = Platform.OS === 'android' ? 915 : 844;
  const scale = Math.min(width / referenceWidth, height / referenceHeight);
  const mascotSize = Math.round(148 * scale);

  const titleColor =  DAY_TITLE;
  const subtitleColor =  DAY_SUBTITLE;
  const closeIconColor = night.text ?? '#2E2A87';
  const closeButtonBg = night.isNight ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.72)';
  const trialBannerBg ='rgba(159, 82, 242, 0.12)';

  const selectedPlan = useMemo(
    () => PAYWALL_PLANS.find((plan) => plan.id === selectedPlanId) ?? PAYWALL_PLANS[0],
    [selectedPlanId],
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

  const handleStartTrial = () => {
    if (isStartingTrial) return;
    setIsStartingTrial(true);
    toast.success(`Selected ${selectedPlan.label} plan. Purchases coming soon.`);
    setIsStartingTrial(false);
  };

  const handleRestore = () => {
    toast.success('No previous purchases found.');
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
            top: insets.top + 10,
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
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        <View style={styles.hero}>
          <Image
            source={BUSINESS_MASCOT}
            style={{ width: mascotSize, height: mascotSize }}
            contentFit="contain"
          />
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
          {PAYWALL_PLANS.map((plan) => (
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
            label="Start 7-day free trial"
            onPress={handleStartTrial}
            loading={isStartingTrial}
            disabled={isStartingTrial}
          />
          <View style={[styles.trialBanner, { backgroundColor: trialBannerBg }]}>
            <Text style={[styles.trialText, { color: titleColor }]}>{selectedPlan.trialSummary}</Text>
          </View>
        </View>

        <View style={styles.footerLinks}>
          <Pressable onPress={() => router.push('/settings/terms-and-conditions' as Href)}>
            <Text style={[styles.footerLink, { color: titleColor }]}>Terms</Text>
          </Pressable>
          <Text style={[styles.footerDot, { color: titleColor }]}>•</Text>
          <Pressable onPress={() => router.push('/settings/privacy-policy' as Href)}>
            <Text style={[styles.footerLink, { color: titleColor }]}>Privacy</Text>
          </Pressable>
          <Text style={[styles.footerDot, { color: titleColor }]}>•</Text>
          <Pressable onPress={handleRestore}>
            <Text style={[styles.footerLink, { color: titleColor }]}>Restore</Text>
          </Pressable>
        </View>
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
    gap: 4,
    paddingTop: 28,
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
