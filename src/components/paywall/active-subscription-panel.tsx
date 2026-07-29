import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { FeatureCard } from '@/src/components/paywall/feature-card';
import { PaywallCtaButton } from '@/src/components/paywall/paywall-cta-button';
import {
  canManageSubscriptionOnDevice,
  crossStoreManageMessage,
  formatSubscriptionExpiry,
  planLabelForProductId,
  planPeriodLabelForProductId,
  subscriptionStatusLabel,
  subscriptionStoreLabel,
  type UserSubscription,
} from '@/src/config/subscription';
import { PAYWALL_FEATURES } from '@/src/data/paywall';
import { Typography } from '@/src/theme/fonts';

type ActiveSubscriptionPanelProps = {
  subscription: UserSubscription;
  titleColor: string;
  subtitleColor: string;
  bannerBg: string;
  onManage: () => void;
  onDone: () => void;
};

export function ActiveSubscriptionPanel({
  subscription,
  titleColor,
  subtitleColor,
  bannerBg,
  onManage,
  onDone,
}: ActiveSubscriptionPanelProps) {
  const planLabel = planLabelForProductId(subscription.productId);
  const periodLabel = planPeriodLabelForProductId(subscription.productId);
  const statusLabel = subscriptionStatusLabel(subscription.status);
  const storeLabel = subscriptionStoreLabel(subscription.store);
  const expiry = formatSubscriptionExpiry(subscription.expiresAt);
  const canManage = canManageSubscriptionOnDevice(subscription.store, Platform.OS);
  const manageHint = canManage ? null : crossStoreManageMessage(subscription.store);
  const renewLabel =
    subscription.willRenew === false
      ? 'Access until'
      : subscription.status === 'trialing'
        ? 'Trial ends'
        : 'Renews';

  return (
    <View style={styles.root}>
      <View style={styles.heroCopy}>
        <Text style={[styles.title, { color: titleColor }]}>{"You're on Bobble Pro"}</Text>
        <Text style={[styles.subtitle, { color: subtitleColor }]}>
          {periodLabel} plan · {statusLabel}
        </Text>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: bannerBg }]}>
        <SummaryRow label="Plan" value={planLabel} color={titleColor} />
        <SummaryRow label="Status" value={statusLabel} color={titleColor} />
        {storeLabel ? <SummaryRow label="Purchased on" value={storeLabel} color={titleColor} /> : null}
        {expiry ? (
          <SummaryRow label={renewLabel} value={expiry} color={titleColor} isLast={!manageHint} />
        ) : null}
        {manageHint ? (
          <Text style={[styles.crossStoreHint, { color: titleColor }]}>{manageHint}</Text>
        ) : null}
      </View>

      <View style={styles.features}>
        {PAYWALL_FEATURES.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </View>

      <View style={styles.ctaBlock}>
        {canManage ? (
          <PaywallCtaButton label="Manage subscription" onPress={onManage} />
        ) : (
          <View style={[styles.lockedManage, { backgroundColor: bannerBg }]}>
            <Text style={[styles.lockedManageTitle, { color: titleColor }]}>
              Manage on {storeLabel ?? 'purchase store'}
            </Text>
            <Text style={[styles.lockedManageBody, { color: subtitleColor }]}>
              {"Subscription changes aren't available on this device."}
            </Text>
          </View>
        )}
        <Pressable onPress={onDone} hitSlop={8} accessibilityRole="button" accessibilityLabel="Done">
          <Text style={[styles.doneHint, { color: subtitleColor }]}>Done</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  color,
  isLast,
}: {
  label: string;
  value: string;
  color: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.summaryRow, !isLast && styles.summaryRowBorder]}>
      <Text style={[styles.summaryLabel, { color }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 16,
  },
  heroCopy: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    ...Typography.heading,
    fontSize: Platform.OS === 'android' ? 28 : 26,
    lineHeight: Platform.OS === 'android' ? 34 : 32,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.subheading,
    fontSize: Platform.OS === 'android' ? 16 : 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  summaryCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
  },
  summaryRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(46, 42, 135, 0.16)',
  },
  summaryLabel: {
    ...Typography.caption,
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.8,
  },
  summaryValue: {
    ...Typography.socialButton,
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
    textAlign: 'right',
  },
  crossStoreHint: {
    ...Typography.caption,
    fontSize: 13,
    lineHeight: 18,
    paddingTop: 4,
    paddingBottom: 12,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ctaBlock: {
    gap: 12,
    alignItems: 'center',
  },
  lockedManage: {
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  lockedManageTitle: {
    ...Typography.socialButton,
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  lockedManageBody: {
    ...Typography.caption,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  doneHint: {
    ...Typography.caption,
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 4,
  },
});
