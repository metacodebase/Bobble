/** Lifetime free-tier bobble cap — keep in sync with backend FREE_BOBBLE_LIMIT. */
export const FREE_BOBBLE_LIMIT = 10;

/** Manual free-tier task create cap — keep in sync with backend FREE_TASK_CREATE_LIMIT. */
export const FREE_TASK_CREATE_LIMIT = 25;

/** RevenueCat entitlement — must match the dashboard and backend. */
export const BOBBLE_PRO_ENTITLEMENT = 'bobble_pro';

/** Store product IDs — must match Play Console + App Store Connect + RevenueCat. */
export const PRODUCT_IDS = {
  monthly: 'bobble_pro_monthly',
  annual: 'bobble_pro_annual',
} as const;

export type StoreProductId = (typeof PRODUCT_IDS)[keyof typeof PRODUCT_IDS];

export const RC_OFFERING_ID = 'default';

export type SubscriptionStore = 'app_store' | 'play_store' | 'promotional' | 'unknown';
export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'canceled'
  | 'expired'
  | 'billing_issue'
  | 'none';

export interface UserSubscription {
  isPro: boolean;
  productId?: string;
  store?: SubscriptionStore;
  status: SubscriptionStatus;
  expiresAt?: string;
  willRenew?: boolean;
}

export const DEFAULT_SUBSCRIPTION: UserSubscription = {
  isPro: false,
  status: 'none',
};

export function planLabelForProductId(productId?: string): string {
  if (productId === PRODUCT_IDS.annual) return 'Bobble Pro (Annual)';
  if (productId === PRODUCT_IDS.monthly) return 'Bobble Pro (Monthly)';
  if (productId) return 'Bobble Pro';
  return 'Free';
}
