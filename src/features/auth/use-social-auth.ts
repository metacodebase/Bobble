import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { useSocialLogin } from '@/src/hooks/api';
import { toast } from '@/src/utils/toast';

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

let googleConfigured = false;

function configureGoogle() {
  if (googleConfigured) return;
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    // We only need identity (idToken) + basic profile.
    scopes: ['profile', 'email'],
  });
  googleConfigured = true;
}

export function useSocialAuth() {
  const socialLogin = useSocialLogin();
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    configureGoogle();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    let active = true;
    AppleAuthentication.isAvailableAsync()
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

  const signInWithGoogle = useCallback(async () => {
    if (!GOOGLE_WEB_CLIENT_ID && !GOOGLE_IOS_CLIENT_ID) {
      toast.error('Google sign-in is not configured');
      return;
    }
    try {
      configureGoogle();
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();

      if (!isSuccessResponse(response)) {
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
    } catch (error) {
      if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }
      if (isErrorWithCode(error) && error.code === statusCodes.IN_PROGRESS) {
        return;
      }
      toast.error('Google sign-in failed, please try again');
    }
  }, [socialLogin]);

  const signInWithApple = useCallback(async () => {
    try {
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
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code?: string }).code === 'ERR_REQUEST_CANCELED'
      ) {
        return;
      }
      toast.error('Apple sign-in failed, please try again');
    }
  }, [socialLogin]);

  return {
    signInWithGoogle,
    signInWithApple,
    appleAvailable,
    isPending: socialLogin.isPending,
  };
}
