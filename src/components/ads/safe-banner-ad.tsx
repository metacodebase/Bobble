import { useState } from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAdsState } from '@/src/hooks/use-ads';
import { getGoogleMobileAds } from '@/src/services/google-mobile-ads';

type SafeBannerAdProps = {
  style?: StyleProp<ViewStyle>;
};

export const BANNER_AD_RESERVED_HEIGHT = 60;

const ADMOB_BANNER_ID_PATTERN = /^ca-app-pub-\d{16}\/\d{10}$/;

function getBannerId(testId?: string) {
  if (__DEV__) return testId;
  const unitId = Platform.select({
    android: process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_ID,
    ios: process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_ID,
  })?.trim();

  if (!unitId || !ADMOB_BANNER_ID_PATTERN.test(unitId) || unitId.includes('3940256099942544')) {
    return undefined;
  }
  return unitId;
}

export function SafeBannerAd({ style }: SafeBannerAdProps) {
  const ads = useAdsState();
  const [failed, setFailed] = useState(false);
  const adsModule = getGoogleMobileAds();
  const unitId = getBannerId(adsModule?.TestIds.ADAPTIVE_BANNER);

  if (!adsModule || !ads.canRequestAds || failed || !unitId) return null;

  const { BannerAd, BannerAdSize } = adsModule;

  return (
    <View pointerEvents="box-none" style={style}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: ads.requestNonPersonalizedAdsOnly,
        }}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}
