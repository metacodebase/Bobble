# Bobble

React Native mobile app built with [Expo](https://expo.dev) and [Expo Router](https://docs.expo.dev/router/introduction/).

## Get started

1. Install dependencies

   ```bash
   yarn install
   ```

2. Copy environment variables

   ```bash
   cp .env.example .env
   ```

3. Set the API host in `src/config/urls.js` (or `EXPO_PUBLIC_API_URL` for production)

   - `USE_PROD = true` → production HTTPS API
   - `USE_PROD = false` → local backend (`http://localhost:8000`)

4. Start the app

   ```bash
   yarn start
   ```

## Project structure

```
app/           # Expo Router screens and layouts
src/
  api/         # API client modules
  components/  # Shared UI components
  config/      # App configuration
  features/    # Feature-specific modules
  hooks/       # React hooks (including TanStack Query)
  services/    # API service, query client, secure storage
  store/       # Zustand state stores
  theme/       # Design tokens and colors
  types/       # Shared TypeScript types
  utils/       # Helpers
plugins/       # Expo config plugins
scripts/       # Utility scripts
```

## Scripts

- `yarn start` — Start Expo dev server
- `yarn android` — Run on Android
- `yarn ios` — Run on iOS
- `yarn lint` — Run ESLint
- `yarn format` — Format with Prettier
- `yarn type-check` — TypeScript check

## Deferred: Login with X

**Status:** Blocked until the client grants authority to manage DNS for `bobble.au`.

The X developer app has been created, but production authentication must not be enabled against the backend's raw HTTP IP address. The intended public API origin and OAuth callback are:

```text
https://api.bobble.au
https://api.bobble.au/api/auth/x/callback
```

Do not register or ship `http://34.204.180.53/api/auth/x/callback` as the production callback. X requires an exact callback match, production OAuth should use HTTPS, and the server IP may change.

### Prerequisite: domain and HTTPS

Once DNS authority is available:

1. Add an `A` record for `api.bobble.au` pointing to the production API server.
2. Configure the server/reverse proxy with `server_name api.bobble.au`.
3. Issue and configure a valid TLS certificate for `api.bobble.au`.
4. Confirm `https://api.bobble.au/api/health` responds successfully.
5. Change the production URL in `src/config/urls.js` to:

   ```js
   production: process.env.EXPO_PUBLIC_API_URL || 'https://api.bobble.au',
   ```

6. Configure the exact HTTPS callback in the X Developer Console.

### X Developer Console settings

- OAuth version: OAuth 2.0
- App type: Web App, Automated App or Bot (confidential client)
- App permission: Read
- Required identity scopes: `users.read users.email`
- Callback URI: `https://api.bobble.au/api/auth/x/callback`
- Website: `https://bobble.au`
- Terms and privacy URLs: use the final deployed legal-site URLs

The OAuth 2.0 Client ID is not secret. The Client Secret must only be stored in the backend's secret/environment manager. It must never be committed, embedded in the Expo app, placed in a deep link, included in screenshots, or copied into documentation. Regenerate any secret that has been shared outside the secret manager.

Backend environment variables:

```env
X_CLIENT_ID=<oauth-2-client-id>
X_CLIENT_SECRET=<secret-manager-value>
X_CALLBACK_URL=https://api.bobble.au/api/auth/x/callback
```

### Intended authentication flow

1. The app opens `GET /api/auth/x/start` in an authentication browser session.
2. The backend creates a random OAuth `state`, PKCE verifier, and S256 challenge, stores them with a short expiry, and redirects to X.
3. X authenticates the user and redirects to `/api/auth/x/callback` with an authorization code.
4. The backend validates `state` and exchanges the code immediately at `https://api.x.com/2/oauth2/token` using the stored PKCE verifier.
5. The backend fetches the authenticated profile from `GET https://api.x.com/2/users/me` and requests only the fields Bobble needs.
6. Bobble identifies the X account by its stable X user ID, not by its username.
7. The backend creates a short-lived, single-use Bobble exchange code and redirects to `bobble://auth/x?code=<exchange-code>`.
8. The app exchanges that one-time code with the Bobble API for the normal Bobble access and refresh tokens.

Never put the X access token, X client secret, Bobble access token, or Bobble refresh token in the deep-link URL.

### Backend work

- Add `/api/auth/x/start`, `/api/auth/x/callback`, and a single-use code exchange endpoint.
- Add `x` to the supported authentication-provider types and validation schemas.
- Store OAuth state/PKCE data and login exchange codes with short expirations and one-time consumption.
- Retrieve the user's X ID, name, username, profile image, and confirmed email when X makes it available.
- If X does not return an email, require the user to enter and verify one before account creation.
- Do not fabricate placeholder email addresses.
- Rate-limit the start, callback, and exchange endpoints and avoid logging OAuth codes or tokens.

Before adding X, replace the user's single `provider`/`providerId` fields with a collection of linked identities, for example:

```ts
identities: Array<{
  provider: 'google' | 'apple' | 'x';
  providerId: string;
}>;
```

Enforce uniqueness for provider plus provider ID. Do not automatically link an X identity to an existing Bobble account solely because an email matches; require authentication with the existing account before linking.

### Mobile work

- Add `signInWithX()` to `src/features/auth/use-social-auth.ts`.
- Open the backend start endpoint with Expo WebBrowser/AuthSession.
- Handle the `bobble://auth/x` deep link and exchange its single-use code with the backend.
- Add `x` to the pending-provider state and route the existing X button to `signInWithX()` in `app/(auth)/sign-in.tsx`.
- Treat user cancellation silently and display other failures through the Bobble toast.
- Rebuild and test native iOS and Android builds after authentication/deep-link configuration changes.

### Acceptance checklist

- New X user can create a Bobble account.
- Returning X user reaches the same Bobble account.
- Missing X email enters Bobble's email-verification flow.
- Existing Google, Apple, or local account is not silently taken over or relinked.
- Cancelled authorization returns safely to the sign-in screen.
- Reused, expired, mismatched-state, and invalid exchange codes are rejected.
- Production callback uses `https://api.bobble.au` and matches the X configuration exactly.
- No provider or Bobble secrets appear in logs, URLs, the mobile bundle, source control, or documentation.
