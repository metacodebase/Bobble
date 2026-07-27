/**
 * Hermes headless widget tasks disable microtasks. Without this polyfill,
 * react-native-android-widget's background task can fail and leave a transparent widget.
 */
function isSetImmediateFunctional() {
  if (typeof globalThis.setImmediate === 'undefined') return false;
  try {
    globalThis.setImmediate(() => {});
    return true;
  } catch {
    return false;
  }
}

if (!isSetImmediateFunctional()) {
  globalThis.setImmediate = function (handler, ...args) {
    return setTimeout(() => handler(...args), 0);
  };
}
