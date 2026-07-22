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
echo "Push notifications: rebuild after changing google-services.json or expo-notifications."
echo "Expo push token: run npm run setup:eas once (free — no EAS credentials upload)."
