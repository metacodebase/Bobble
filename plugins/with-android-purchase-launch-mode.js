const { withAndroidManifest } = require('expo/config-plugins');

/** @type {import('expo/config-plugins').ConfigPlugin} */
function withAndroidPurchaseLaunchMode(config) {
  return withAndroidManifest(config, (cfg) => {
    const applications = cfg.modResults.manifest.application ?? [];
    const mainActivity = applications
      .flatMap((application) => application.activity ?? [])
      .find((activity) => activity.$?.['android:name'] === '.MainActivity');

    if (!mainActivity) {
      throw new Error('Unable to find .MainActivity in AndroidManifest.xml');
    }

    // RevenueCat requires standard or singleTop so external payment
    // verification can return to the active purchase flow.
    mainActivity.$['android:launchMode'] = 'singleTop';

    return cfg;
  });
}

module.exports = withAndroidPurchaseLaunchMode;
