// /**
//  * Storage Service
//  * Wrapper for secure storage using MMKV for performance
//  */

// import { MMKV } from 'react-native-mmkv';

// // Initialize MMKV instance
// const mmkv = new MMKV({
//   id: 'flowvest-storage',
//   encryptionKey: 'flowvest-encryption-key', // In production, use a secure key
// });

// export const storage = {
//   // Set item
//   setItem: async (key: string, value: any): Promise<void> => {
//     try {
//       const jsonValue = JSON.stringify(value);
//       mmkv.set(key, jsonValue);
//     } catch (error) {
//       console.error('Storage setItem error:', error);
//       throw error;
//     }
//   },

//   // Get item
//   getItem: async (key: string): Promise<any> => {
//     try {
//       const jsonValue = mmkv.getString(key);
//       return jsonValue ? JSON.parse(jsonValue) : null;
//     } catch (error) {
//       console.error('Storage getItem error:', error);
//       return null;
//     }
//   },

//   // Remove item
//   removeItem: async (key: string): Promise<void> => {
//     try {
//       mmkv.delete(key);
//     } catch (error) {
//       console.error('Storage removeItem error:', error);
//       throw error;
//     }
//   },

//   // Clear all storage
//   clear: async (): Promise<void> => {
//     try {
//       mmkv.clearAll();
//     } catch (error) {
//       console.error('Storage clear error:', error);
//       throw error;
//     }
//   },

//   // Get all keys
//   getAllKeys: async (): Promise<string[]> => {
//     try {
//       return mmkv.getAllKeys();
//     } catch (error) {
//       console.error('Storage getAllKeys error:', error);
//       return [];
//     }
//   },

//   // Check if key exists
//   hasKey: async (key: string): Promise<boolean> => {
//     try {
//       return mmkv.contains(key);
//     } catch (error) {
//       console.error('Storage hasKey error:', error);
//       return false;
//     }
//   },

//   // Set multiple items
//   multiSet: async (keyValuePairs: Array<[string, any]>): Promise<void> => {
//     try {
//       for (const [key, value] of keyValuePairs) {
//         await storage.setItem(key, value);
//       }
//     } catch (error) {
//       console.error('Storage multiSet error:', error);
//       throw error;
//     }
//   },

//   // Get multiple items
//   multiGet: async (keys: string[]): Promise<Array<[string, any]>> => {
//     try {
//       const results: Array<[string, any]> = [];
//       for (const key of keys) {
//         const value = await storage.getItem(key);
//         results.push([key, value]);
//       }
//       return results;
//     } catch (error) {
//       console.error('Storage multiGet error:', error);
//       return [];
//     }
//   },

//   // Remove multiple items
//   multiRemove: async (keys: string[]): Promise<void> => {
//     try {
//       for (const key of keys) {
//         await storage.removeItem(key);
//       }
//     } catch (error) {
//       console.error('Storage multiRemove error:', error);
//       throw error;
//     }
//   },
// };

// // Storage keys constants
// export const StorageKeys = {
//   // Authentication
//   AUTH_TOKEN: '@flowvest:token',
//   REFRESH_TOKEN: '@flowvest:refresh_token',
//   USER_DATA: '@flowvest:user_data',
  
//   // User preferences
//   THEME: '@flowvest:theme',
//   LANGUAGE: '@flowvest:language',
//   BIOMETRICS_ENABLED: '@flowvest:biometrics_enabled',
//   NOTIFICATIONS_ENABLED: '@flowvest:notifications_enabled',
  
//   // App state
//   ONBOARDING_COMPLETED: '@flowvest:onboarding_completed',
//   LAST_SYNC: '@flowvest:last_sync',
  
//   // Cache
//   INVESTMENTS_CACHE: '@flowvest:investments_cache',
//   PORTFOLIO_CACHE: '@flowvest:portfolio_cache',
//   PAYOUTS_CACHE: '@flowvest:payouts_cache',
// }; 


/**
 * Storage Service
 * Wrapper for secure storage using AsyncStorage (Expo-compatible)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  // Set item
  setItem: async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Storage setItem error:', error);
      throw error;
    }
  },

  // Get item
  getItem: async (key: string): Promise<any> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },

  // Remove item
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
      throw error;
    }
  },

  // Clear all storage
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
      throw error;
    }
  },

  // Get all keys
  getAllKeys: async (): Promise<string[]> => {
    try {
      return [...(await AsyncStorage.getAllKeys())];
    } catch (error) {
      console.error('Storage getAllKeys error:', error);
      return [];
    }
  },

  // Check if key exists
  hasKey: async (key: string): Promise<boolean> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.includes(key);
    } catch (error) {
      console.error('Storage hasKey error:', error);
      return false;
    }
  },

  // Set multiple items
  multiSet: async (keyValuePairs: Array<[string, any]>): Promise<void> => {
    try {
      const jsonPairs = keyValuePairs.map(([key, value]) => [key, JSON.stringify(value)]) as [string, string][];
      await AsyncStorage.multiSet(jsonPairs);
    } catch (error) {
      console.error('Storage multiSet error:', error);
      throw error;
    }
  },

  // Get multiple items
  multiGet: async (keys: string[]): Promise<Array<[string, any]>> => {
    try {
      const raw = await AsyncStorage.multiGet(keys);
      return raw.map(([key, value]) => [key, value ? JSON.parse(value) : null]);
    } catch (error) {
      console.error('Storage multiGet error:', error);
      return [];
    }
  },

  // Remove multiple items
  multiRemove: async (keys: string[]): Promise<void> => {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Storage multiRemove error:', error);
      throw error;
    }
  },
};

// Storage keys constants
export const StorageKeys = {
  // Authentication
  AUTH_TOKEN: '@flowvest:token',
  // REFRESH_TOKEN: '@flowvest:refresh_token',
  EXPIRES_AT: '@flowvest:expires_at',
  USER_DATA: '@flowvest:user_data',
  SESSION: '@flowvest:session',
  // User preferences
  THEME: '@flowvest:theme',
  LANGUAGE: '@flowvest:language',
  BIOMETRICS_ENABLED: '@flowvest:biometrics_enabled',
  NOTIFICATIONS_ENABLED: '@flowvest:notifications_enabled',

  // App state
  ONBOARDING_COMPLETED: '@flowvest:onboarding_completed',
  LAST_SYNC: '@flowvest:last_sync',

  // Cache
  INVESTMENTS_CACHE: '@flowvest:investments_cache',
  PORTFOLIO_CACHE: '@flowvest:portfolio_cache',
  PAYOUTS_CACHE: '@flowvest:payouts_cache',
};
