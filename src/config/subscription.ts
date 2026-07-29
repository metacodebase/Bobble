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

export function planPeriodLabelForProductId(productId?: string): string {
  if (productId === PRODUCT_IDS.annual) return 'Annual';
  if (productId === PRODUCT_IDS.monthly) return 'Monthly';
  return 'Pro';
}

export function subscriptionStatusLabel(status: SubscriptionStatus): string {
  switch (status) {
    case 'trialing':
      return 'Free trial';
    case 'active':
      return 'Active';
    case 'canceled':
      return 'Canceling';
    case 'billing_issue':
      return 'Billing issue';
    case 'expired':
      return 'Expired';
    default:
      return 'Free';
  }
}

export function subscriptionStoreLabel(store?: SubscriptionStore): string | undefined {
  switch (store) {
    case 'app_store':
      return 'App Store';
    case 'play_store':
      return 'Google Play';
    case 'promotional':
      return 'Promotional';
    default:
      return undefined;
  }
}

export function formatSubscriptionExpiry(expiresAt?: string): string | undefined {
  if (!expiresAt) return undefined;
  const date = new Date(expiresAt);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

type MobilePlatform = 'ios' | 'android' | 'windows' | 'macos' | 'web';

/** Store that bills subscriptions on the given OS. */
export function platformBillingStore(platform: MobilePlatform): SubscriptionStore | null {
  if (platform === 'ios') return 'app_store';
  if (platform === 'android') return 'play_store';
  return null;
}

/**
 * True when this device can change/cancel the subscription in its native store.
 * Play purchases must be managed on Android / Google Play; App Store on iOS.
 */
export function canManageSubscriptionOnDevice(
  store: SubscriptionStore | undefined,
  platform: MobilePlatform
): boolean {
  if (store === 'promotional') return false;
  if (store !== 'app_store' && store !== 'play_store') return false;
  return platformBillingStore(platform) === store;
}

/** Copy when the user tries to manage a subscription billed on the other store. */
export function crossStoreManageMessage(store: SubscriptionStore | undefined): string {
  if (store === 'play_store') {
    return 'This subscription was purchased on Google Play. Manage or cancel it from an Android device signed into the same Google account.';
  }
  if (store === 'app_store') {
    return 'This subscription was purchased on the App Store. Manage or cancel it from an iPhone or iPad signed into the same Apple ID.';
  }
  if (store === 'promotional') {
    return 'This is a promotional Pro grant. It is not managed through the App Store or Google Play.';
  }
  return 'Manage this subscription from the device and store where it was originally purchased.';
}
