import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, TurboModuleRegistry } from 'react-native';

import { isDemoMode } from '@/src/config/backend';
import { useSocialLogin } from '@/src/hooks/api';
import { toast } from '@/src/utils/toast';

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const X_CLIENT_ID =
  process.env.EXPO_PUBLIC_X_CLIENT_ID || process.env.EXPO_PUBLIC_TWITTER_CLIENT_ID;
const X_REDIRECT_URI = process.env.EXPO_PUBLIC_X_REDIRECT_URI;

let googleConfigured = false;

/**
 * Google Sign-In registers `RNGoogleSignin` in the native binary. Calling
 * `import('@react-native-google-signin/google-signin')` evaluates
 * TurboModuleRegistry.getEnforcing and throws if that module is missing
 * (Expo Go, or a native build from before the plugin was added). Probe with
 * the non-throwing `get` first.
 */
function isGoogleNativeAvailable(): boolean {
  return TurboModuleRegistry.get('RNGoogleSignin') != null;
}

/**
 * Google/Apple SDKs touch native modules at import time. Keep those behind
 * dynamic imports so expo-router's sync route discovery in Android dev
 * doesn't drop `sign-in` when the native module isn't ready yet.
 */
async function loadGoogleSignin() {
  if (!isGoogleNativeAvailable()) {
    throw new Error('GOOGLE_NATIVE_UNAVAILABLE');
  }
  return import('@react-native-google-signin/google-signin');
}

async function loadAppleAuthentication() {
  return import('expo-apple-authentication');
}

async function configureGoogle() {
  if (googleConfigured) return;
  const { GoogleSignin } = await loadGoogleSignin();
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    // We only need identity (idToken) + basic profile.
    scopes: ['profile', 'email'],
  });
  googleConfigured = true;
}

function isGoogleNativeError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.message === 'GOOGLE_NATIVE_UNAVAILABLE' ||
    error.message.includes('RNGoogleSignin') ||
    error.message.includes('TurboModuleRegistry.getEnforcing')
  );
}

function getGoogleSignInErrorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error == null || !('code' in error)) return undefined;
  const code = (error as { code?: unknown }).code;
  return code == null ? undefined : String(code);
}

function isGoogleDeveloperError(error: unknown): boolean {
  const code = getGoogleSignInErrorCode(error);
  const message = error instanceof Error ? error.message : String(error);
  return (
    code === '10' ||
    message.includes('DEVELOPER_ERROR') ||
    message.includes('Developer console is not set up correctly')
  );
}

function getGoogleSignInErrorMessage(
  error: unknown,
  statusCodes?: { PLAY_SERVICES_NOT_AVAILABLE: string }
): string {
  if (isGoogleDeveloperError(error)) {
    return Platform.OS === 'android'
      ? 'Google Sign-In is not set up for this Android build. Add your app SHA-1 in Firebase (Project settings → Your apps → Android), download a new google-services.json, and rebuild.'
      : 'Google Sign-In is not configured correctly for this build. Check Firebase / Google Cloud OAuth client IDs and rebuild.';
  }

  const code = getGoogleSignInErrorCode(error);
  if (statusCodes && code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    return 'Google Play Services is required for sign-in. Please update Play Services and try again.';
  }

  if (__DEV__) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('[Google Sign-In]', { code, message, error });
  }

  return 'Google sign-in failed, please try again';
}

type SocialPendingProvider = 'google' | 'apple' | 'x';

export function useSocialAuth() {
  const socialLogin = useSocialLogin();
  const [appleAvailable, setAppleAvailable] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<SocialPendingProvider | null>(null);
  const isMountedRef = useRef(true);
  const xAuthInFlightRef = useRef(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    let active = true;
    void loadAppleAuthentication()
      .then((AppleAuthentication) => AppleAuthentication.isAvailableAsync())
      .then((available) => {
        if (active) setAppleAvailable(available);
      })
      .catch(() => {
        if (active) setAppleAvailable(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Drop the OAuth-phase spinner once the API mutation reports pending (or finishes).
  useEffect(() => {
    if (!socialLogin.isPending) return;
    setOauthProvider(null);
  }, [socialLogin.isPending]);

  const signInWithGoogle = useCallback(async () => {
    if (isDemoMode) {
      socialLogin.mutate({ provider: 'google', idToken: 'offline-demo' });
      return;
    }
    if (!GOOGLE_WEB_CLIENT_ID && !GOOGLE_IOS_CLIENT_ID) {
      toast.error('Google sign-in is not configured');
      return;
    }
    if (!isGoogleNativeAvailable()) {
      toast.error('Google sign-in requires a rebuilt Android app (expo run:android)');
      return;
    }

    setOauthProvider('google');
    let submitted = false;
    try {
      const google = await loadGoogleSignin();
      await configureGoogle();
      await google.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await google.GoogleSignin.signIn();

      if (!google.isSuccessResponse(response)) {
        // User cancelled the picker — stay silent.
        return;
      }

      const { idToken, user } = response.data;
      if (!idToken) {
        toast.error('Google did not return a token, please try again');
        return;
      }

      socialLogin.mutate({
        provider: 'google',
        idToken,
        name: user.name ?? undefined,
      });
      submitted = true;
    } catch (error) {
      if (isGoogleNativeError(error)) {
        toast.error('Google sign-in requires a rebuilt Android app (expo run:android)');
        return;
      }
      let statusCodes: { PLAY_SERVICES_NOT_AVAILABLE: string } | undefined;
      try {
        const google = await loadGoogleSignin();
        statusCodes = google.statusCodes;
        if (google.isErrorWithCode(error) && error.code === google.statusCodes.SIGN_IN_CANCELLED) {
          return;
        }
        if (google.isErrorWithCode(error) && error.code === google.statusCodes.IN_PROGRESS) {
          return;
        }
      } catch {
        // Ignore secondary load failures while classifying the original error.
      }
      toast.error(getGoogleSignInErrorMessage(error, statusCodes));
    } finally {
      if (!submitted) setOauthProvider(null);
    }
  }, [socialLogin]);

  const signInWithApple = useCallback(async () => {
    if (isDemoMode) {
      socialLogin.mutate({ provider: 'apple', idToken: 'offline-demo' });
      return;
    }
    setOauthProvider('apple');
    let submitted = false;
    try {
      const AppleAuthentication = await loadAppleAuthentication();
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        toast.error('Apple did not return a token, please try again');
        return;
      }

      const fullName = [credential.fullName?.givenName, credential.fullName?.familyName]
        .filter(Boolean)
        .join(' ')
        .trim();

      socialLogin.mutate({
        provider: 'apple',
        idToken: credential.identityToken,
        name: fullName || undefined,
      });
      submitted = true;
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code?: string }).code === 'ERR_REQUEST_CANCELED'
      ) {
        return;
      }
      toast.error('Apple sign-in failed, please try again');
    } finally {
      if (!submitted) setOauthProvider(null);
    }
  }, [socialLogin]);

  const signInWithX = useCallback(async () => {
    if (xAuthInFlightRef.current) return;
    if (isDemoMode) {
      socialLogin.mutate({ provider: 'x', idToken: 'offline-demo' });
      return;
    }
    if (!X_CLIENT_ID) {
      toast.error('Set EXPO_PUBLIC_X_CLIENT_ID in .env and restart the app');
      return;
    }

    setOauthProvider('x');
    xAuthInFlightRef.current = true;
    let submitted = false;
    try {
      const AuthSession = await import('expo-auth-session');
      // Prefer app deep link. Ignore Firebase HTTPS handler — it cannot return to the native app.
      const envRedirect = X_REDIRECT_URI?.trim();
      const redirectUri =
        envRedirect && !/^https?:\/\//i.test(envRedirect)
          ? envRedirect
          : AuthSession.makeRedirectUri({ scheme: 'bobble', path: 'auth/x' });

      // X OAuth 2.0 requires authorization code + PKCE (not implicit token).
      const request = new AuthSession.AuthRequest({
        clientId: X_CLIENT_ID,
        redirectUri,
        scopes: ['tweet.read', 'users.read', 'users.email', 'offline.access'],
        responseType: AuthSession.ResponseType.Code,
        usePKCE: true,
      });
      const discovery = {
        authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize',
        tokenEndpoint: 'https://api.twitter.com/2/oauth2/token',
      };
      const result = await request.promptAsync(discovery);

      if (result.type !== 'success') {
        return;
      }

      const code = typeof result.params.code === 'string' ? result.params.code : undefined;
      if (!code || !request.codeVerifier) {
        toast.error('X did not return an auth code, please try again');
        return;
      }

      const tokenResult = await AuthSession.exchangeCodeAsync(
        {
          clientId: X_CLIENT_ID,
          code,
          redirectUri,
          extraParams: {
            code_verifier: request.codeVerifier,
          },
        },
        discovery
      );

      const accessToken = tokenResult.accessToken;
      if (!accessToken) {
        toast.error('X did not return a token, please try again');
        return;
      }

      socialLogin.mutate({
        provider: 'x',
        // Backend social endpoint reuses `idToken` payload key for provider tokens.
        idToken: accessToken,
      });
      submitted = true;
    } catch {
      if (isMountedRef.current) {
        toast.error('X sign-in failed, please try again');
      }
    } finally {
      xAuthInFlightRef.current = false;
      if (!submitted && isMountedRef.current) setOauthProvider(null);
    }
  }, [socialLogin]);

  const pendingProvider: SocialPendingProvider | null =
    oauthProvider ??
    (socialLogin.isPending
      ? ((socialLogin.variables?.provider as SocialPendingProvider | undefined) ?? null)
      : null);

  return {
    signInWithGoogle,
    signInWithApple,
    signInWithX,
    appleAvailable,
    pendingProvider,
    isPending: pendingProvider !== null,
  };
}
