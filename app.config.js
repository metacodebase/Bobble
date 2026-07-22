/** Injects EAS project ID from env into app config for Expo push tokens. */
const appJson = require('./app.json');

module.exports = ({ config }) => ({
  ...appJson.expo,
  ...config,
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
});
