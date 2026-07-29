#!/usr/bin/env bash
# Link this app to a free Expo project (for push notification tokens).
#
# You do NOT need EAS credentials / FCM upload for local builds:
#   npm run android:apk   → release APK on your Mac
#   npm run android:aab   → Play Console AAB (internal/open testing)
#   npm run ios:archive   → TestFlight IPA via Xcode
#
# This script only creates/links the Expo project ID (free expo.dev account).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
ENV_FILE="$ROOT/.env"

read_env_project_id() {
  if [[ -f "$ENV_FILE" ]]; then
    grep -E '^EXPO_PUBLIC_EAS_PROJECT_ID=' "$ENV_FILE" 2>/dev/null | cut -d= -f2- | tr -d '"' | tr -d "'" || true
  fi
}

EXISTING_ID="$(read_env_project_id)"
if [[ -n "$EXISTING_ID" ]]; then
  echo "EXPO_PUBLIC_EAS_PROJECT_ID already set in .env:"
  echo "  $EXISTING_ID"
  exit 0
fi

if ! command -v eas >/dev/null 2>&1; then
  echo "Installing eas-cli..."
  npm install -g eas-cli
fi

echo "==> Log in to Expo (free account) if prompted..."
if ! eas whoami >/dev/null 2>&1; then
  eas login
fi

echo "==> Linking project (creates free Expo project ID)..."
eas init --non-interactive 2>/dev/null || eas init

PROJECT_ID=""
if [[ -f app.json ]]; then
  PROJECT_ID="$(node -e "
    const cfg = require('./app.config.js')({ config: {} });
    process.stdout.write(cfg?.extra?.eas?.projectId || '');
  " 2>/dev/null || true)"
fi

if [[ -z "$PROJECT_ID" ]]; then
  PROJECT_ID="$(read_env_project_id)"
fi

if [[ -z "$PROJECT_ID" ]]; then
  echo ""
  echo "Could not read project ID automatically."
  echo "Open https://expo.dev → your project → Project settings → copy Project ID"
  echo "Then add to .env:"
  echo "  EXPO_PUBLIC_EAS_PROJECT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  exit 1
fi

if [[ -f "$ENV_FILE" ]]; then
  if grep -q '^EXPO_PUBLIC_EAS_PROJECT_ID=' "$ENV_FILE"; then
    sed -i '' "s|^EXPO_PUBLIC_EAS_PROJECT_ID=.*|EXPO_PUBLIC_EAS_PROJECT_ID=$PROJECT_ID|" "$ENV_FILE"
  else
    printf '\nEXPO_PUBLIC_EAS_PROJECT_ID=%s\n' "$PROJECT_ID" >> "$ENV_FILE"
  fi
else
  cp .env.example "$ENV_FILE" 2>/dev/null || true
  printf 'EXPO_PUBLIC_EAS_PROJECT_ID=%s\n' "$PROJECT_ID" >> "$ENV_FILE"
fi

echo ""
echo "==> Done. Project ID saved to .env:"
echo "  EXPO_PUBLIC_EAS_PROJECT_ID=$PROJECT_ID"
echo ""
echo "Next — local builds (no EAS credentials upload):"
echo "  npm run android:apk"
echo "  npm run android:aab"
echo "  npm run ios:archive"
