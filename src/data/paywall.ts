import { ImageSourcePropType } from 'react-native';

export type PaywallPlanId = 'annual' | 'monthly';

export type PaywallFeature = {
  id: string;
  label: string;
  icon: ImageSourcePropType;
};

export type PaywallPlan = {
  id: PaywallPlanId;
  label: string;
  priceLabel: string;
  period: string;
  badge?: string;
  savingsLabel?: string;
  trialSummary: string;
};

export const PAYWALL_FEATURES: readonly PaywallFeature[] = [
  {
    id: 'unlimited',
    label: 'Unlimited Bobbles',
    icon: require('@/src/assets/images/paywall/feature-unlimited.png'),
  },
  {
    id: 'ads',
    label: 'Zero Ads',
    icon: require('@/src/assets/images/paywall/feature-no-ads.png'),
  },
  {
    id: 'tasks',
    label: 'Tasks & Reminders',
    icon: require('@/src/assets/images/paywall/feature-tasks.png'),
  },
  {
    id: 'insights',
    label: 'Mind Maps & Insights',
    icon: require('@/src/assets/images/paywall/feature-insights.png'),
  },
] as const;

export const PAYWALL_PLANS: readonly PaywallPlan[] = [
  {
    id: 'annual',
    label: 'Annual',
    priceLabel: '$89.91',
    period: 'year',
    badge: 'BEST VALUE',
    savingsLabel: 'Save 25%',
    trialSummary:
      "7 days free, then $89.91 / year. Cancel anytime. We'll remind you before your trial ends.",
  },
  {
    id: 'monthly',
    label: 'Monthly',
    priceLabel: '$9.99',
    period: 'month',
    trialSummary:
      "7 days free, then $9.99 / month. Cancel anytime. We'll remind you before your trial ends.",
  },
] as const;

export const DEFAULT_PAYWALL_PLAN: PaywallPlanId = 'annual';
