import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesOfferings,
  type PurchasesPackage,
} from 'react-native-purchases';

import {
  BOBBLE_PRO_ENTITLEMENT,
  PRODUCT_IDS,
  RC_OFFERING_ID,
  type StoreProductId,
} from '@/src/config/subscription';
import type { PaywallPlanId } from '@/src/data/paywall';

let configured = false;

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

export async function configurePurchases(): Promise<void> {
  if (configured || !isPurchasesSupported()) return;

  const apiKey = apiKeyForPlatform();
  if (!apiKey) {
    console.warn(
      '[purchases] Missing EXPO_PUBLIC_RC_IOS_API_KEY / EXPO_PUBLIC_RC_ANDROID_API_KEY / EXPO_PUBLIC_RC_TEST_API_KEY — purchases disabled'
    );
    return;
  }

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  Purchases.configure({ apiKey });
  configured = true;
}

export async function loginPurchases(userId: string): Promise<CustomerInfo | null> {
  if (!configured || !userId) return null;
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    return customerInfo;
  } catch (error) {
    console.warn('[purchases] logIn failed', error);
    return null;
  }
}

export async function logoutPurchases(): Promise<void> {
  if (!configured) return;
  try {
    await Purchases.logOut();
  } catch (error) {
    console.warn('[purchases] logOut failed', error);
  }
}

export function customerHasPro(info: CustomerInfo | null | undefined): boolean {
  return info?.entitlements.active[BOBBLE_PRO_ENTITLEMENT] != null;
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
          pkg.product.identifier === PRODUCT_IDS.annual
      ) ??
      null
    );
  }

  return (
    offering.monthly ??
    offering.availablePackages.find(
      (pkg) =>
        pkg.packageType === Purchases.PACKAGE_TYPE.MONTHLY ||
        pkg.product.identifier === PRODUCT_IDS.monthly
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

export async function purchasePlan(planId: PaywallPlanId): Promise<{
  customerInfo: CustomerInfo;
  productId?: StoreProductId | string;
}> {
  if (!configured) {
    throw new Error('Purchases are not configured. Add RevenueCat API keys and rebuild.');
  }

  const offerings = await Purchases.getOfferings();
  const pkg = packageForPlan(offerings, planId);
  if (!pkg) {
    throw new Error('Subscription package is unavailable. Try again later.');
  }

  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return { customerInfo, productId: pkg.product.identifier };
}

export async function restorePurchases(): Promise<CustomerInfo> {
  if (!configured) {
    throw new Error('Purchases are not configured. Add RevenueCat API keys and rebuild.');
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
