/** Injects EAS project ID from env into app config for Expo push tokens. */
const appJson = require('./app.json');

const GOOGLE_SAMPLE_ADMOB_APP_IDS = {
  android: 'ca-app-pub-3940256099942544~3347511713',
  ios: 'ca-app-pub-3940256099942544~1458002511',
};

const ADMOB_APP_ID_PATTERN = /^ca-app-pub-\d{16}~\d{10}$/;

function getAdMobAppId(platform, isDevelopment) {
  if (isDevelopment) return GOOGLE_SAMPLE_ADMOB_APP_IDS[platform];

  const envName = `EXPO_PUBLIC_ADMOB_${platform.toUpperCase()}_APP_ID`;
  const appId = process.env[envName]?.trim();
  if (!appId || !ADMOB_APP_ID_PATTERN.test(appId) || appId.includes('3940256099942544')) {
    throw new Error(`${envName} must be set to a real AdMob app ID for non-development builds.`);
  }
  return appId;
}

module.exports = ({ config }) => {
  const basePlugins = config?.plugins ?? appJson.expo.plugins ?? [];
  const isDevelopment = (process.env.EXPO_PUBLIC_APP_ENV ?? 'development') === 'development';

  return {
    ...appJson.expo,
    ...config,
    plugins: [
      ...basePlugins,
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: getAdMobAppId('android', isDevelopment),
          iosAppId: getAdMobAppId('ios', isDevelopment),
          delayAppMeasurementInit: true,
          userTrackingUsageDescription:
            'Bobble uses this identifier only with your permission to deliver and measure personalized ads on the free plan.',
        },
      ],
    ],
    extra: {
      ...appJson.expo.extra,
      ...config?.extra,
      eas: {
        ...appJson.expo.extra?.eas,
        ...config?.extra?.eas,
        projectId:
          process.env.EXPO_PUBLIC_EAS_PROJECT_ID ??
          appJson.expo.extra?.eas?.projectId ??
          config?.extra?.eas?.projectId,
      },
    },
  };
};
