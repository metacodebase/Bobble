#!/usr/bin/env bash
# Build a Play Store–ready Android App Bundle (AAB) locally (no EAS queue).
#
# Requires credentials/android/bobble-upload.keystore + keystore.properties
# (created once by this script if missing). BACK UP the keystore — losing it
# blocks Play Store updates unless you use Play App Signing with a new upload key.
#
# Upload the AAB in Play Console → Testing → Internal testing (or Open testing).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ANDROID="$ROOT/android"
CREDS="$ROOT/credentials/android"
KEYSTORE="$CREDS/bobble-upload.keystore"
PROPS="$CREDS/keystore.properties"
AAB_DIR="$ANDROID/app/build/outputs/bundle/release"
AAB="$AAB_DIR/app-release.aab"
PACKAGE="com.bobble.au"

cd "$ROOT"

ensure_keystore() {
  mkdir -p "$CREDS"
  if [[ -f "$KEYSTORE" && -f "$PROPS" ]]; then
    echo "==> Using existing upload keystore: $KEYSTORE"
    return
  fi

  echo "==> Generating Play upload keystore (one-time)..."
  STORE_PASS="$(openssl rand -base64 32 | tr -d '/+=' | head -c 32)"
  keytool -genkeypair -v \
    -storetype PKCS12 \
    -keystore "$KEYSTORE" \
    -alias bobble-upload \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass "$STORE_PASS" \
    -keypass "$STORE_PASS" \
    -dname "CN=Bobble, OU=Mobile, O=Metadots, L=Sydney, ST=NSW, C=AU"

  cat > "$PROPS" <<EOF
storePassword=$STORE_PASS
keyPassword=$STORE_PASS
keyAlias=bobble-upload
storeFile=bobble-upload.keystore
EOF

  echo ""
  echo "IMPORTANT: Back up these files somewhere safe (password manager / encrypted drive):"
  echo "  $KEYSTORE"
  echo "  $PROPS"
  echo ""
}

inject_release_signing() {
  local build_gradle="$ANDROID/app/build.gradle"
  if [[ ! -f "$build_gradle" ]]; then
    echo "ERROR: missing $build_gradle — prebuild failed?" >&2
    exit 1
  fi

  # Copy keystore next to the app module so relative paths stay simple.
  cp "$KEYSTORE" "$ANDROID/app/bobble-upload.keystore"
  cp "$PROPS" "$ANDROID/keystore.properties"

  if grep -q 'bobbleKeystoreProperties\|bobble-upload' "$build_gradle"; then
    echo "==> Release signing already present in build.gradle"
    return
  fi

  echo "==> Injecting Play upload signing into android/app/build.gradle..."
  python3 - "$build_gradle" <<'PY'
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text()
marker = "signingConfigs {"
if "bobble-upload" in text:
    raise SystemExit(0)
if marker not in text:
    raise SystemExit("signingConfigs block not found in build.gradle")

inject_props = """
    def bobbleKeystorePropertiesFile = rootProject.file("keystore.properties")
    def bobbleKeystoreProperties = new Properties()
    if (bobbleKeystorePropertiesFile.exists()) {
        bobbleKeystoreProperties.load(new FileInputStream(bobbleKeystorePropertiesFile))
    }
"""

inject_signing = """
        release {
            if (bobbleKeystorePropertiesFile.exists()) {
                keyAlias bobbleKeystoreProperties['keyAlias']
                keyPassword bobbleKeystoreProperties['keyPassword']
                storeFile file(bobbleKeystoreProperties['storeFile'])
                storePassword bobbleKeystoreProperties['storePassword']
            }
        }
"""

# Insert Properties load before signingConfigs
text = text.replace(
    "    signingConfigs {",
    inject_props + "\n    signingConfigs {",
    1,
)

# Insert release signingConfig after debug block's closing brace inside signingConfigs
debug_block_end = """            keyPassword 'android'
        }
"""
if debug_block_end not in text:
    raise SystemExit("debug signingConfig block not found")
text = text.replace(
    debug_block_end,
    debug_block_end + inject_signing,
    1,
)

# Point release buildType at release signing
old_release = """        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug
"""
new_release = """        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig bobbleKeystorePropertiesFile.exists() ? signingConfigs.release : signingConfigs.debug
"""
if old_release not in text:
    # Fallback: replace any release signingConfig line
    import re
    text2, n = re.subn(
        r"(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.debug",
        r"\1signingConfig bobbleKeystorePropertiesFile.exists() ? signingConfigs.release : signingConfigs.debug",
        text,
        count=1,
    )
    if n != 1:
        raise SystemExit("could not update release signingConfig")
    text = text2
else:
    text = text.replace(old_release, new_release, 1)

path.write_text(text)
print("Patched", path)
PY
}

print_fingerprints() {
  local pass
  pass="$(grep '^storePassword=' "$PROPS" | cut -d= -f2-)"
  echo ""
  echo "==> Upload keystore fingerprints (add SHA-1 to Firebase if you regenerate the key):"
  keytool -list -v -keystore "$KEYSTORE" -alias bobble-upload -storepass "$pass" 2>/dev/null \
    | awk '/SHA1:|SHA256:/{print}'
}

ensure_keystore

echo "==> Package: $PACKAGE"
echo "==> Syncing native Android project..."
npx expo prebuild --platform android --no-install

inject_release_signing

echo "==> Building release AAB (bundleRelease)..."
(cd "$ANDROID" && ./gradlew bundleRelease)

if [[ ! -f "$AAB" ]]; then
  echo "ERROR: AAB not found at $AAB" >&2
  exit 1
fi

print_fingerprints

echo ""
echo "==> Play Store AAB ready:"
echo "  $AAB"
echo "  size: $(du -h "$AAB" | awk '{print $1}')"
echo ""
echo "Play Console steps:"
echo "  1. https://play.google.com/console → Create app (or open Bobble)"
echo "    Package name must be: $PACKAGE"
echo "  2. Enable Play App Signing when prompted (keep using this upload keystore)"
echo "  3. Testing → Internal testing → Create new release → Upload the AAB"
echo "  4. Add license testers / your Google account, then roll out"
echo "  5. Monetize → Products → Subscriptions → create products"
echo "     (IDs must match RevenueCat: bobble_pro_monthly / bobble_pro_annual)"
echo "  6. Link Play to RevenueCat (Service Account JSON + package $PACKAGE)"
echo ""
echo "Optional EAS cloud build later:"
echo "  eas build --platform android --profile production"
echo "  eas submit --platform android --profile internal"
