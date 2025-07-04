/**
 * Redux Persist Configuration
 * Configures which parts of state to persist
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistConfig } from 'redux-persist';
import { RootState } from './rootReducer';

export const persistConfig: PersistConfig<RootState> = {
  key: 'flowvest',
  storage: AsyncStorage,
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