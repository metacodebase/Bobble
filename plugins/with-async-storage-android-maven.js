/**
 * @react-native-async-storage/async-storage v3+ publishes storage-android only in android/local_repo.
 */
const { withProjectBuildGradle } = require('expo/config-plugins');

const MAVEN_BLOCK = `
    // @react-native-async-storage/async-storage v3+ (storage-android AAR is vendored here)
    maven {
      url = uri("\${rootProject.projectDir}/../node_modules/@react-native-async-storage/async-storage/android/local_repo")
    }`;

/** @type {import('expo/config-plugins').ConfigPlugin} */
function withAsyncStorageAndroidMaven(config) {
  return withProjectBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== 'groovy') {
      return cfg;
    }
    const { contents } = cfg.modResults;
    if (contents.includes('async-storage/async-storage/android/local_repo')) {
      return cfg;
    }
    const needle = 'allprojects {\n  repositories {\n';
    if (!contents.includes(needle)) {
      return cfg;
    }
    cfg.modResults.contents = contents.replace(needle, `${needle}${MAVEN_BLOCK}\n`);
    return cfg;
  });
}

module.exports = withAsyncStorageAndroidMaven;
