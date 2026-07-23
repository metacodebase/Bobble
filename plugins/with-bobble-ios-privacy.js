const { withInfoPlist } = require('expo/config-plugins');

const PHOTO_LIBRARY_USAGE =
  'Bobble uses your photo library so you can choose a profile picture.';
const PHOTO_LIBRARY_ADD_USAGE =
  'Bobble saves achievement cards to your photo library when you tap Save to Photos.';

/** Ensure App Store-required privacy purpose strings are always present in Info.plist. */
function withBobbleIosPrivacy(config) {
  return withInfoPlist(config, (cfg) => {
    cfg.modResults.NSPhotoLibraryUsageDescription = PHOTO_LIBRARY_USAGE;
    cfg.modResults.NSPhotoLibraryAddUsageDescription = PHOTO_LIBRARY_ADD_USAGE;
    return cfg;
  });
}

module.exports = withBobbleIosPrivacy;
