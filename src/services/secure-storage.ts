import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type StorageAdapter = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

function createWebStorage(): StorageAdapter {
  return {
    getItem: async (key) => {
      if (typeof window === 'undefined') return null;
      return AsyncStorage.getItem(key);
    },
    setItem: async (key, value) => {
      if (typeof window === 'undefined') return;
      await AsyncStorage.setItem(key, value);
    },
    removeItem: async (key) => {
      if (typeof window === 'undefined') return;
      await AsyncStorage.removeItem(key);
    },
  };
}

function createNativeStorage(): StorageAdapter {
  return {
    getItem: (key) => SecureStore.getItemAsync(key),
    setItem: (key, value) => SecureStore.setItemAsync(key, value),
    removeItem: (key) => SecureStore.deleteItemAsync(key),
  };
}

/** Secure storage on native; AsyncStorage on web (SecureStore is unavailable there). */
export const secureStorage: StorageAdapter =
  Platform.OS === 'web' ? createWebStorage() : createNativeStorage();
