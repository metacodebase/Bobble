/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: 'widget',
  name: 'BobbleWidget',
  displayName: 'Bobble Tasks',
  icon: '../../src/assets/images/bobble-app-icon.png',
  deploymentTarget: '17.0',
  colors: {
    $widgetBackground: '#9F52F2',
    $accent: '#9F52F2',
    gradientTop: '#9F52F2',
    gradientBottom: '#D8B4FE',
  },
  // Mascot images available to SwiftUI as Image("mascot-...").
  // Keep in sync with the moods in src/features/widget/widget-data.ts.
  images: {
    'mascot-empty': '../../src/assets/images/bobble-sound.png',
    'mascot-starting': '../../src/assets/images/bobble-writing.png',
    'mascot-working': '../../src/assets/images/bobble-hammer.png',
    'mascot-almost': '../../src/assets/images/bobble-nerd.png',
    'mascot-done': '../../src/assets/images/mascot/bobble-greet.png',
  },
  entitlements: {
    'com.apple.security.application-groups': ['group.metadots.bobble.app'],
  },
};
