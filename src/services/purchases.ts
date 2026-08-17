import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesOfferings,
  type PurchasesPackage,
} from 'react-native-purchases';

import {
  BOBBLE_PRO_ENTITLEMENT,
  RC_OFFERING_ID,
  canonicalProductId,
  isAnnualProductId,
  isMonthlyProductId,
  type SubscriptionStatus,
  type SubscriptionStore,
  type StoreProductId,
  type UserSubscription,
} from '@/src/config/subscription';
import type { PaywallPlanId } from '@/src/data/paywall';

let configured = false;
/** RevenueCat App User ID after a successful configure(appUserID) or logIn. */
let loggedInUserId: string | null = null;
/** Shared by repeated auth-state cleanup so RevenueCat is logged out only once. */
let logoutPromise: Promise<void> | null = null;
let anonymousIdentityPromise: Promise<boolean> | null = null;

/**
 * Prefer platform public keys (appl_ / goog_). Fall back to a single Test Store
 * key (test_…) for local/dev purchases without App Store / Play Billing.
 */
function apiKeyForPlatform(): string | null {
  const testKey = process.env.EXPO_PUBLIC_RC_TEST_API_KEY?.trim() || null;
  if (Platform.OS === 'ios') {
    return process.env.EXPO_PUBLIC_RC_IOS_API_KEY?.trim() || testKey;
  }
  if (Platform.OS === 'android') {
    return process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY?.trim() || testKey;
  }
  return testKey;
}

export function isPurchasesSupported(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

export function getPurchasesLoggedInUserId(): string | null {
  return loggedInUserId;
}

export function isPurchasesIdentityReady(userId: string): boolean {
  return configured && Boolean(userId) && loggedInUserId === userId;
}

export function isAnonymousPurchasesReady(): boolean {
  return configured && loggedInUserId === null;
}

export async function configurePurchases(appUserID?: string): Promise<void> {
  if (configured || !isPurchasesSupported()) return;

  const apiKey = apiKeyForPlatform();
  if (!apiKey) {
    console.warn(
      '[purchases] Missing EXPO_PUBLIC_RC_IOS_API_KEY / EXPO_PUBLIC_RC_ANDROID_API_KEY / EXPO_PUBLIC_RC_TEST_API_KEY — purchases disabled'
    );
    return;
  }

  if (!__DEV__ && apiKey.startsWith('test_')) {
    console.warn('[purchases] Test Store API key blocked in release builds');
    return;
  }

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  Purchases.configure({
    apiKey,
    ...(appUserID ? { appUserID } : {}),
  });
  configured = true;
  if (appUserID) {
    loggedInUserId = appUserID;
  }
}

export async function loginPurchases(userId: string): Promise<CustomerInfo | null> {
  if (!userId) return null;
  if (!configured) {
    await configurePurchases(userId);
  }
  if (!configured) return null;

  if (loggedInUserId === userId) {
    try {
      return await Purchases.getCustomerInfo();
    } catch {
      return null;
    }
  }

  try {
    const { customerInfo } = await Purchases.logIn(userId);
    loggedInUserId = userId;
    return customerInfo;
  } catch (error) {
    console.warn('[purchases] logIn failed', error);
    return null;
  }
}

/**
 * Ensures SDK is configured and the App User ID matches our Mongo user before purchase.
 */
export async function ensurePurchasesIdentity(userId: string): Promise<boolean> {
  if (!isPurchasesSupported() || !userId) return false;
  if (isPurchasesIdentityReady(userId)) return true;

  await configurePurchases(userId);
  if (!configured) return false;

  if (loggedInUserId === userId) return true;

  const info = await loginPurchases(userId);
  return isPurchasesIdentityReady(userId) && info != null;
}

export async function ensureAnonymousPurchasesIdentity(): Promise<boolean> {
  if (!isPurchasesSupported()) return false;
  await configurePurchases();
  if (!configured) return false;
  if (anonymousIdentityPromise) return anonymousIdentityPromise;

  anonymousIdentityPromise = (async () => {
    try {
      if (!(await Purchases.isAnonymous())) {
        await Purchases.logOut();
      }
      loggedInUserId = null;
      return true;
    } catch (error) {
      console.warn('[purchases] anonymous identity setup failed', error);
      return false;
    }
  })();

  try {
    return await anonymousIdentityPromise;
  } finally {
    anonymousIdentityPromise = null;
  }
}

export async function logoutPurchases(): Promise<void> {
  if (!configured || !loggedInUserId) return;
  if (logoutPromise) return logoutPromise;

  logoutPromise = (async () => {
    try {
      // logOut() itself changes an identified customer into an anonymous one.
      // The auth mutation and PurchasesBootstrap can both reach this cleanup,
      // so re-check native state before calling it.
      if (!(await Purchases.isAnonymous())) {
        await Purchases.logOut();
      }
    } catch (error) {
      const code =
        error && typeof error === 'object' && 'code' in error
          ? String((error as { code: unknown }).code)
          : undefined;
      if (code !== Purchases.PURCHASES_ERROR_CODE.LOG_OUT_ANONYMOUS_USER_ERROR) {
        console.warn('[purchases] logOut failed', error);
      }
    } finally {
      loggedInUserId = null;
    }
  })();

  try {
    await logoutPromise;
  } finally {
    logoutPromise = null;
  }
}

export function customerHasPro(info: CustomerInfo | null | undefined): boolean {
  return info?.entitlements.active[BOBBLE_PRO_ENTITLEMENT] != null;
}

function subscriptionStoreFromRevenueCat(store: string): SubscriptionStore {
  switch (store) {
    case 'APP_STORE':
    case 'MAC_APP_STORE':
      return 'app_store';
    case 'PLAY_STORE':
      return 'play_store';
    case 'PROMOTIONAL':
      return 'promotional';
    default:
      return 'unknown';
  }
}

/**
 * Convert the entitlement returned by the native SDK into the app's UI model.
 * This lets a completed purchase unlock the UI immediately while the backend
 * independently reconciles the same RevenueCat customer.
 */
export function subscriptionFromCustomerInfo(
  info: CustomerInfo | null | undefined
): UserSubscription | null {
  const entitlement = info?.entitlements.active[BOBBLE_PRO_ENTITLEMENT];
  if (!entitlement) return null;

  let status: SubscriptionStatus = 'active';
  if (entitlement.billingIssueDetectedAt) {
    status = 'billing_issue';
  } else if (entitlement.unsubscribeDetectedAt) {
    status = 'canceled';
  } else if (entitlement.periodType.toUpperCase() === 'TRIAL') {
    status = 'trialing';
  }

  return {
    isPro: true,
    productId: canonicalProductId(entitlement.productIdentifier) ?? entitlement.productIdentifier,
    store: subscriptionStoreFromRevenueCat(entitlement.store),
    status,
    expiresAt: entitlement.expirationDate ?? undefined,
    willRenew: entitlement.willRenew,
  };
}

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!configured) return null;
  try {
    return await Purchases.getCustomerInfo();
  } catch (error) {
    console.warn('[purchases] getCustomerInfo failed', error);
    return null;
  }
}

export async function getOfferings(): Promise<PurchasesOfferings | null> {
  if (!configured) return null;
  try {
    return await Purchases.getOfferings();
  } catch (error) {
    console.warn('[purchases] getOfferings failed', error);
    return null;
  }
}

function packageForPlan(
  offerings: PurchasesOfferings,
  planId: PaywallPlanId
): PurchasesPackage | null {
  const offering =
    offerings.all[RC_OFFERING_ID] ?? offerings.current ?? Object.values(offerings.all)[0];
  if (!offering) return null;

  if (planId === 'annual') {
    return (
      offering.annual ??
      offering.availablePackages.find(
        (pkg) =>
          pkg.packageType === Purchases.PACKAGE_TYPE.ANNUAL ||
          isAnnualProductId(pkg.product.identifier)
      ) ??
      null
    );
  }

  return (
    offering.monthly ??
    offering.availablePackages.find(
      (pkg) =>
        pkg.packageType === Purchases.PACKAGE_TYPE.MONTHLY ||
        isMonthlyProductId(pkg.product.identifier)
    ) ??
    null
  );
}

export type StorePriceLabels = Partial<Record<PaywallPlanId, string>>;

export function priceLabelsFromOfferings(offerings: PurchasesOfferings | null): StorePriceLabels {
  if (!offerings) return {};
  const labels: StorePriceLabels = {};
  const annual = packageForPlan(offerings, 'annual');
  const monthly = packageForPlan(offerings, 'monthly');
  if (annual?.product.priceString) labels.annual = annual.product.priceString;
  if (monthly?.product.priceString) labels.monthly = monthly.product.priceString;
  return labels;
}

export async function purchasePlan(
  planId: PaywallPlanId,
  userId?: string
): Promise<{
  customerInfo: CustomerInfo;
  productId?: StoreProductId | string;
}> {
  const ready = userId
    ? await ensurePurchasesIdentity(userId)
    : await ensureAnonymousPurchasesIdentity();
  if (!ready) {
    throw new Error('Purchases are not ready. Try again shortly.');
  }

  const offerings = await Purchases.getOfferings();
  const pkg = packageForPlan(offerings, planId);
  if (!pkg) {
    throw new Error('Subscription package is unavailable. Try again later.');
  }

  const { customerInfo } = await Purchases.purchasePackage(pkg);
  // Prefer subscription id (strip Play base plan) so app + backend stay aligned with iOS.
  const productId =
    (canonicalProductId(pkg.product.identifier) as StoreProductId | undefined) ??
    pkg.product.identifier;
  return { customerInfo, productId };
}

export async function restorePurchases(userId?: string): Promise<CustomerInfo> {
  const ready = userId
    ? await ensurePurchasesIdentity(userId)
    : await ensureAnonymousPurchasesIdentity();
  if (!ready) {
    throw new Error('Purchases are not ready. Try again shortly.');
  }
  return Purchases.restorePurchases();
}

export function isPurchaseCancelled(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const code = (error as { code?: unknown }).code;
  return code === Purchases.PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR;
}

export function getPurchaseErrorMessage(error: unknown, fallback = 'Purchase failed'): string {
  if (isPurchaseCancelled(error)) return 'Purchase cancelled';
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as { message: unknown }).message);
    if (message) return message;
  }
  return fallback;
}
