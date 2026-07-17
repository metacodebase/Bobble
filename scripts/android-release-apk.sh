#!/usr/bin/env bash
# Build a release APK locally (no EAS queue).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID="$ROOT/android"
APK_DIR="$ANDROID/app/build/outputs/apk/release"
APK="$APK_DIR/app-release.apk"

cd "$ROOT"

echo "==> Syncing native Android project (google-services.json, plugins, version)..."
npx expo prebuild --platform android --no-install

echo "==> Building release APK..."
(cd "$ANDROID" && ./gradlew assembleRelease)

if [[ ! -f "$APK" ]]; then
  echo "ERROR: APK not found at $APK" >&2
  exit 1
fi

echo ""
echo "==> Release APK ready:"
echo "  $APK"
echo ""
echo "Install on a connected device:"
echo "  adb install -r \"$APK\""
echo ""
echo "Google Sign-In: release builds currently use android/app/debug.keystore."
echo "If you switch to a production keystore, add its SHA-1 in Firebase and"
echo "download an updated google-services.json before distributing."
