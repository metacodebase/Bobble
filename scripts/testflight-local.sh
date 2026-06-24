#!/usr/bin/env bash
# Local iOS archive + TestFlight upload (no EAS queue).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IOS="$ROOT/ios"
SCHEME="Bobble"
WORKSPACE="$IOS/Bobble.xcworkspace"
ARCHIVE="$IOS/build/Bobble.xcarchive"
EXPORT_DIR="$IOS/build/export"
EXPORT_PLIST="$IOS/ExportOptions.plist"
BUNDLE_ID="metadots.bobble.app"
TEAM_ID="${APPLE_TEAM_ID:-A9X3L9QMZT}"

cd "$ROOT"

echo "==> Bundle ID: $BUNDLE_ID | Team: $TEAM_ID"

if [[ ! -d "$WORKSPACE" ]]; then
  echo "==> Generating native iOS project..."
  npx expo prebuild --platform ios --clean
fi

echo "==> Installing pods..."
(cd "$IOS" && pod install)

echo "==> Archiving (Release)..."
xcodebuild \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration Release \
  -destination "generic/platform=iOS" \
  -archivePath "$ARCHIVE" \
  archive \
  DEVELOPMENT_TEAM="$TEAM_ID" \
  CODE_SIGN_STYLE=Automatic \
  -allowProvisioningUpdates

echo "==> Exporting App Store IPA..."
rm -rf "$EXPORT_DIR"
xcodebuild \
  -exportArchive \
  -archivePath "$ARCHIVE" \
  -exportPath "$EXPORT_DIR" \
  -exportOptionsPlist "$EXPORT_PLIST" \
  -allowProvisioningUpdates

IPA="$(find "$EXPORT_DIR" -name '*.ipa' | head -1)"
echo "==> IPA: $IPA"

if [[ -n "${ASC_API_KEY_ID:-}" && -n "${ASC_API_KEY_ISSUER_ID:-}" && -n "${ASC_API_KEY_PATH:-}" ]]; then
  echo "==> Uploading via App Store Connect API key..."
  xcrun altool --upload-app \
    --type ios \
    --file "$IPA" \
    --apiKey "$ASC_API_KEY_ID" \
    --apiIssuer "$ASC_API_KEY_ISSUER_ID"
elif [[ -n "${APPLE_ID:-}" && -n "${APPLE_APP_SPECIFIC_PASSWORD:-}" ]]; then
  echo "==> Uploading via Apple ID..."
  xcrun altool --upload-app \
    --type ios \
    --file "$IPA" \
    --username "$APPLE_ID" \
    --password "$APPLE_APP_SPECIFIC_PASSWORD"
else
  echo ""
  echo "Upload credentials not set. IPA is ready at:"
  echo "  $IPA"
  echo ""
  echo "Upload with one of:"
  echo "  1. Transporter app (drag IPA in)"
  echo "  2. export APPLE_ID=... APPLE_APP_SPECIFIC_PASSWORD=... && $0"
  echo "  3. export ASC_API_KEY_ID=... ASC_API_KEY_ISSUER_ID=... ASC_API_KEY_PATH=... && $0"
  echo ""
  echo "Or open Xcode: Window > Organizer > Archives > Distribute App"
fi
