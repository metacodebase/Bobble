/** Injects EAS project ID from env into app config for Expo push tokens. */
const appJson = require('./app.json');

const GOOGLE_SAMPLE_ADMOB_APP_IDS = {
  android: 'ca-app-pub-3940256099942544~3347511713',
  ios: 'ca-app-pub-3940256099942544~1458002511',
};

module.exports = ({ config }) => {
  const basePlugins = config?.plugins ?? appJson.expo.plugins ?? [];

  return {
    ...appJson.expo,
    ...config,
    plugins: [
      ...basePlugins,
      [
        'react-native-google-mobile-ads',
        {
          androidAppId:
            process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID || GOOGLE_SAMPLE_ADMOB_APP_IDS.android,
          iosAppId: process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID || GOOGLE_SAMPLE_ADMOB_APP_IDS.ios,
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
