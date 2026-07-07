/**
 * Android 12+ splash only supports a solid background color plus a centered icon
 * through expo-splash-screen. This plugin uses the full composite splash image
 * as the window background so it matches iOS (one.png + centered bobble-main).
 */
const fs = require('fs');
const path = require('path');

const {
  withAndroidStyles,
  withDangerousMod,
  AndroidConfig,
} = require('expo/config-plugins');

const SPLASH_ASSET = 'src/assets/images/splash-native.png';
const DRAWABLE_NAME = 'splashscreen_full';
const TRANSPARENT_ICON = 'splashscreen_transparent_icon';
const SPLASH_STYLE = {
  name: 'Theme.App.SplashScreen',
  parent: 'Theme.SplashScreen',
};

/** @type {import('expo/config-plugins').ConfigPlugin} */
function withBobbleNativeSplash(config) {
  config = withDangerousMod(config, [
    'android',
    async (cfg) => {
      const projectRoot = cfg.modRequest.projectRoot;
      const drawableDir = path.join(
        projectRoot,
        'android/app/src/main/res/drawable-nodpi',
      );
      const source = path.join(projectRoot, SPLASH_ASSET);

      await fs.promises.mkdir(drawableDir, { recursive: true });
      await fs.promises.copyFile(
        source,
        path.join(drawableDir, `${DRAWABLE_NAME}.png`),
      );

      const transparentIcon = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        'base64',
      );
      await fs.promises.writeFile(
        path.join(drawableDir, `${TRANSPARENT_ICON}.png`),
        transparentIcon,
      );

      return cfg;
    },
  ]);

  config = withAndroidStyles(config, (cfg) => {
    cfg.modResults = AndroidConfig.Styles.assignStylesValue(cfg.modResults, {
      add: true,
      parent: SPLASH_STYLE,
      name: 'windowSplashScreenBackground',
      value: `@drawable/${DRAWABLE_NAME}`,
    });

    cfg.modResults = AndroidConfig.Styles.assignStylesValue(cfg.modResults, {
      add: true,
      parent: SPLASH_STYLE,
      name: 'windowSplashScreenAnimatedIcon',
      value: `@drawable/${TRANSPARENT_ICON}`,
    });

    return cfg;
  });

  return config;
}

module.exports = withBobbleNativeSplash;
