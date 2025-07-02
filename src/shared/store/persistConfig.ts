/**
 * Redux Persist Configuration
 * Configures which parts of state to persist
 */

import { MMKV } from 'react-native-mmkv';
import { PersistConfig } from 'redux-persist';
import { RootState } from './rootReducer';

// Create MMKV storage instance for Redux Persist
const storage = new MMKV({
  id: 'redux-persist',
  encryptionKey: 'flowvest-redux-key',
});

// Redux Persist MMKV adapter
const reduxStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

export const persistConfig: PersistConfig<RootState> = {
  key: 'flowvest',
  storage: reduxStorage,
  version: 1,
  // Whitelist - Only persist these reducers
  whitelist: [
    'auth',      // Authentication state
    'user',      // User preferences and settings
    'theme',     // Theme preferences
  ],
  // Blacklist - Don't persist these reducers
  blacklist: [
    'loading',   // Loading states are temporary
    'errors',    // Error states should be fresh
    'network',   // Network status changes frequently
  ],
  // Transform data before persisting
  transforms: [],
  // Migrate state when version changes
  migrate: (state: any) => {
    // Add migration logic here when updating persist version
    return Promise.resolve(state);
  },
  // Debug mode
  debug: process.env.NODE_ENV === 'development',
}; 