/**
 * Android 12+ SplashScreen overlay only supports a solid color plus icon.
 * This plugin shows splash-native.png via windowBackground and keeps it visible
 * until expo-splash-screen hideAsync(), matching iOS.
 */
const fs = require('fs');
const path = require('path');

const { generateImageAsync, generateImageBackgroundAsync } = require('@expo/image-utils');
const {
  withAndroidStyles,
  withDangerousMod,
} = require('expo/config-plugins');

const SPLASH_ASSET = 'src/assets/images/splash-native.png';
const DRAWABLE_NAME = 'splashscreen_full';
const BACKGROUND_DRAWABLE = 'splashscreen_background';
const SPLASH_STYLE = {
  name: 'Theme.App.SplashScreen',
  parent: 'AppTheme',
};

const SPLASH_DENSITIES = {
  mdpi: { width: 360, height: 780 },
  hdpi: { width: 540, height: 1170 },
  xhdpi: { width: 720, height: 1560 },
  xxhdpi: { width: 1080, height: 2340 },
  xxxhdpi: { width: 1440, height: 3120 },
};

const SPLASH_MANAGER_MARKER = 'Bobble: use windowBackground splash';

const SPLASH_MANAGER_REGISTER = `  fun registerOnActivity(activity: Activity) {
    // ${SPLASH_MANAGER_MARKER}
    ReactMarker.addListener(contentAppearedListener)

    // Using \`splashScreen.setKeepOnScreenCondition()\` does not work on apis below 33
    // so we need to implement this ourselves.
    val contentView = activity.findViewById<View>(android.R.id.content)
    val observer = contentView.viewTreeObserver
    observer.addOnPreDrawListener(object : OnPreDrawListener {
      override fun onPreDraw(): Boolean {
        if (keepSplashScreenOnScreen) {
          return false
        }
        contentView.viewTreeObserver.removeOnPreDrawListener(this)
        return true
      }
    })

    configureSplashScreen()
  }`;

/** @type {import('expo/config-plugins').ConfigPlugin} */
function withBobbleNativeSplash(config) {
  config = withDangerousMod(config, [
    'android',
    async (cfg) => {
      const projectRoot = cfg.modRequest.projectRoot;
      const source = path.join(projectRoot, SPLASH_ASSET);
      const drawableXmlDir = path.join(
        projectRoot,
        'android/app/src/main/res/drawable',
      );
      const managerPath = path.join(
        projectRoot,
        'node_modules/expo-splash-screen/android/src/main/java/expo/modules/splashscreen/SplashScreenManager.kt',
      );

      await fs.promises.mkdir(drawableXmlDir, { recursive: true });

      const nodpiDir = path.join(
        projectRoot,
        'android/app/src/main/res/drawable-nodpi',
      );
      await fs.promises.rm(path.join(nodpiDir, `${DRAWABLE_NAME}.png`), { force: true });

      await Promise.all(
        Object.entries(SPLASH_DENSITIES).map(async ([density, size]) => {
          const { source: image } = await generateImageAsync(
            { projectRoot, cacheType: 'bobble-android-splash' },
            {
              src: source,
              resizeMode: 'cover',
              width: size.width,
              height: size.height,
            },
          );
          const dir = path.join(
            projectRoot,
            `android/app/src/main/res/drawable-${density}`,
          );
          await fs.promises.mkdir(dir, { recursive: true });
          await fs.promises.writeFile(
            path.join(dir, `${DRAWABLE_NAME}.png`),
            image,
          );
        }),
      );

      const backgroundXml = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <item android:drawable="@color/splashscreen_background" />
  <item>
    <bitmap
      android:gravity="fill"
      android:src="@drawable/${DRAWABLE_NAME}" />
  </item>
</layer-list>
`;
      await fs.promises.writeFile(
        path.join(drawableXmlDir, `${BACKGROUND_DRAWABLE}.xml`),
        backgroundXml,
      );

      if (fs.existsSync(managerPath)) {
        let managerSource = await fs.promises.readFile(managerPath, 'utf8');
        const registerStart = managerSource.indexOf('  fun registerOnActivity(activity: Activity) {');
        const registerEnd = managerSource.indexOf('  fun hide() {', registerStart);

        if (registerStart !== -1 && registerEnd !== -1) {
          managerSource =
            managerSource.slice(0, registerStart) +
            SPLASH_MANAGER_REGISTER +
            '\n\n' +
            managerSource.slice(registerEnd);
          await fs.promises.writeFile(managerPath, managerSource);
        }
      }

      return cfg;
    },
  ]);

  config = withAndroidStyles(config, (cfg) => {
    const styles = cfg.modResults;
    const styleList = styles.resources.style ?? [];

    styles.resources.style = [
      ...styleList.filter(({ $ }) => $.name !== SPLASH_STYLE.name),
      {
        $: SPLASH_STYLE,
        item: [
          {
            $: { name: 'android:windowBackground' },
            _: `@drawable/${BACKGROUND_DRAWABLE}`,
          },
          {
            $: { name: 'android:windowDisablePreview' },
            _: 'true',
          },
          {
            $: { name: 'android:statusBarColor' },
            _: '#FBFAFB',
          },
        ],
      },
    ];

    return cfg;
  });

  return config;
}

module.exports = withBobbleNativeSplash;
