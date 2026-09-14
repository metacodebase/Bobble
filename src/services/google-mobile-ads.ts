export function getGoogleMobileAds() {
  try {
    // Expo Go does not include this native module; development/release builds do.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('react-native-google-mobile-ads') as typeof import('react-native-google-mobile-ads');
  } catch {
    return null;
  }
}
