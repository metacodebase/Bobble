import type { RequestOptions } from 'react-native-google-mobile-ads';

export type AdsState = {
  canRequestAds: boolean;
  requestNonPersonalizedAdsOnly: boolean;
  status: 'disabled' | 'checking-consent' | 'ready' | 'error';
};

const disabledState: AdsState = {
  canRequestAds: false,
  requestNonPersonalizedAdsOnly: true,
  status: 'disabled',
};

let state = disabledState;
const listeners = new Set<() => void>();

export function getAdsState() {
  return state;
}

export function subscribeToAdsState(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setAdsState(nextState: AdsState) {
  state = nextState;
  listeners.forEach((listener) => listener());
}

export function disableAds() {
  setAdsState(disabledState);
}

export function getAdRequestOptions(): RequestOptions {
  return { requestNonPersonalizedAdsOnly: state.requestNonPersonalizedAdsOnly };
}
