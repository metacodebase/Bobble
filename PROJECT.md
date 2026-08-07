# Bobble project handoff

This file is a compact context guide for future Codex sessions. Read it before investigating or changing the app.

## Repositories

- Mobile app: `/Users/test/Metadots/Bobble`
- Backend API: `/Users/test/Metadots/bobble_backend`
- Production API process: PM2 process `bobble-api` (inspect with `pm2 status` and `pm2 logs bobble-api`)

## Stack and entry points

- Mobile: Expo Router, React Native, TypeScript, TanStack Query, Zustand, RevenueCat, Firebase/Google sign-in, Apple sign-in.
- Backend: Express + TypeScript + MongoDB/Mongoose, JWT auth, Firebase Admin/FCM, RevenueCat webhooks.
- Mobile routes live in `app/`; shared code is under `src/`.
- API modules: `src/api/`; API host selection: `src/config/urls.js` and `src/config/backend.ts`.
- Query invalidation/cache keys: `src/services/query-keys.ts` and `src/services/query-client.ts`.
- Subscription logic: `src/services/purchases.ts`, `src/config/subscription.ts`.
- Recording disclosure: `src/components/capture/recording-disclosure.tsx`.
- Home screen: `app/(tabs)/index.tsx`.
- Floating bottom navigation: `src/components/ui/floating-tab-bar.tsx`.

## Current product decisions

- First recording disclosure must work for guests and signed-in users, link to the privacy policy, and describe vendors generically: “speech-to-text service” and “AI service.” Do not expose provider names in the in-app modal.
- “STT” means “speech-to-text”; use the full form in user-facing copy when space allows.
- Home’s Today’s Focus/Today’s Progress cards must remain above the bottom tab bar on different screen sizes. The home layout uses window dimensions, flexible scroll content, and tab-bar-aware bottom padding.
- The default bottom tab bar is intended to be transparent over the screen background, with only subtle glass/border treatment.
- Profile task counts must update immediately after task create/delete; invalidate or update the relevant TanStack Query cache rather than waiting for a refetch interval.

## Recent incident fixes / debugging context

- Apple social auth intermittently returned `401` at `/api/auth/social`; successful requests returned `200` and then normal profile/tasks/subscription sync calls. Compare request provider/token payload and backend auth logs before changing client code.
- FCM errors such as “Unable to detect a Project Id” indicate Firebase Admin credentials were not loaded by the running PM2 process. Verify the production env path and restart PM2; a readable local `secrets/firebase-service-account.json` alone does not prove PM2 has the correct env.
- RevenueCat `403` on subscriber lookup usually means the backend is using an invalid/wrong-environment secret key. Never place RevenueCat secret REST keys in the mobile app; use platform public SDK keys in the app and the secret only in backend env.
- RevenueCat webhook endpoint is `/api/webhooks/revenuecat`. If RevenueCat logs `401`, the configured authorization value/signing secret does not match backend env. HMAC signing sends `X-RevenueCat-Webhook-Signature`; test curl may be intentionally unauthenticated depending on route configuration.
- Calendar “sync incomplete” means at least one selected calendar could not be read/written; inspect calendar permission and selected-calendar IDs, not just OAuth connection status.

## Safe verification commands

Mobile:

```bash
cd /Users/test/Metadots/Bobble
npm run type-check
npm run lint
```

Backend:

```bash
cd /Users/test/Metadots/bobble_backend
npm run type-check
npm test
npm run build
```

For production diagnostics, use read-only checks first (`pm2 status`, `pm2 logs`, health endpoint). Do not print `.env`, API keys, signing keys, Firebase JSON, or RevenueCat secrets.

## Deployment notes

- Backend deploy script: `bobble_backend/scripts/deploy.sh`; confirm the target env and PM2 restart after deployment.
- Mobile production host is controlled by `EXPO_PUBLIC_API_URL`/`src/config/urls.js`; avoid shipping a raw IP when a configured HTTPS domain is available.
- Android package is `com.bobble.au`; Firebase SHA-1/SHA-256 and RevenueCat app/product configuration must match it.
- RevenueCat products/entitlement: `bobble_pro_monthly`, `bobble_pro_annual`, entitlement `bobble_pro`, offering `default`.

## Important safety rules

- Treat all credentials pasted into chat or logs as compromised: rotate them, then update only the appropriate secret manager/env file.
- Do not commit `.env`, service-account JSON, Apple/AuthKey files, keystores, JWT secrets, or RevenueCat secret keys.
- Preserve unrelated dirty-worktree changes. Use `apply_patch` for edits.
- Before Expo-specific code changes, follow the repository `AGENTS.md` instruction to consult the requested versioned Expo docs. Note: `package.json` currently declares Expo `~54.0.33`; verify the installed/versioned docs before assuming Expo 56 APIs.

## Fast investigation checklist

1. Identify whether the symptom is mobile UI, API response, third-party configuration, or deployment/env loading.
2. Reproduce with timestamp, platform, app build, endpoint/status, and sanitized logs.
3. Locate the owning module using the entry points above.
4. Fix the smallest layer that owns the problem; invalidate query caches after mutations.
5. Run the relevant type-check/tests, then report files changed and any required production-console/env action.
