/**
 * Storage Service
 * Wrapper for secure storage using AsyncStorage (Expo-compatible)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  // Set item
  setItem: async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      throw error;
    }
  },

  // Get item
  getItem: async (key: string): Promise<any> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      return null;
    }
  },

  // Remove item
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      throw error;
    }
  },

  // Clear all storage
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      throw error;
    }
  },

  // Get all keys
  getAllKeys: async (): Promise<string[]> => {
    try {
      return [...(await AsyncStorage.getAllKeys())];
    } catch (error) {
      return [];
    }
  },

  // Check if key exists
  hasKey: async (key: string): Promise<boolean> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.includes(key);
    } catch (error) {
      return false;
    }
  },

  // Set multiple items
  multiSet: async (keyValuePairs: Array<[string, any]>): Promise<void> => {
    try {
      const jsonPairs = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]) as [string, string][];
      await AsyncStorage.multiSet(jsonPairs);
    } catch (error) {
      throw error;
    }
  },

  // Get multiple items
  multiGet: async (keys: string[]): Promise<Array<[string, any]>> => {
    try {
      const raw = await AsyncStorage.multiGet(keys);
      return raw.map(([key, value]) => [key, value ? JSON.parse(value) : null]);
    } catch (error) {
      return [];
    }
  },

  // Remove multiple items
  multiRemove: async (keys: string[]): Promise<void> => {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      throw error;
    }
  },
};

// Storage keys constants
export const StorageKeys = {
  // Authentication
  AUTH_TOKEN: "@invstrhub:token",
  // REFRESH_TOKEN: '@invstrhub:refresh_token',
  EXPIRES_AT: "@invstrhub:expires_at",
  USER_DATA: "@invstrhub:user_data",
  SESSION: "@invstrhub:session",
  // User preferences
  THEME: "@invstrhub:theme",
  LANGUAGE: "@invstrhub:language",
  BIOMETRICS_ENABLED: "@invstrhub:biometrics_enabled",
  NOTIFICATIONS_ENABLED: "@invstrhub:notifications_enabled",

  // App state
  ONBOARDING_COMPLETED: "@invstrhub:onboarding_completed",
  LAST_SYNC: "@invstrhub:last_sync",

  // Cache
  INVESTMENTS_CACHE: "@invstrhub:investments_cache",
  PORTFOLIO_CACHE: "@invstrhub:portfolio_cache",
  PAYOUTS_CACHE: "@invstrhub:payouts_cache",
};
