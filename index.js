/* eslint-disable import/first --
 * Polyfill + widget handler must run before Expo Router boots the JS runtime.
 * Android headless widget tasks crash under Hermes without setImmediate.
 */
import './src/widgets/set-immediate-polyfill';

import { Platform } from 'react-native';
import { registerWidgetTaskHandler } from 'react-native-android-widget';

import { widgetTaskHandler } from './src/widgets/widget-task-handler';

if (Platform.OS === 'android') {
  registerWidgetTaskHandler(widgetTaskHandler);
}

import 'expo-router/entry';
