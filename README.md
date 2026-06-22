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

3. Start the app

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
