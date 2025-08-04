import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistConfig } from 'redux-persist';
import { RootState } from './rootReducer';

// Redux Persist AsyncStorage adapter (drop-in replacement for MMKV)
const reduxStorage = {
  setItem: (key: string, value: string) => {
    return AsyncStorage.setItem(key, value);
  },
  getItem: (key: string) => {
    return AsyncStorage.getItem(key);
  },
  removeItem: (key: string) => {
    return AsyncStorage.removeItem(key);
  },
};

export const persistConfig: PersistConfig<RootState> = {
  key: 'flowvest',
  storage: AsyncStorage,
  version: 1,
  whitelist: [
    'auth',      // Authentication state
    'user',      // User preferences and settings
    'partner',   // Partner management state
    'theme',     // Theme preferences

  ],
  blacklist: [
    'loading',   // Loading states are temporary
    'errors',    // Error states should be fresh
    'network',   // Network status changes frequently
  ],
  transforms: [],
  migrate: (state: any) => {
    return Promise.resolve(state);
  },
  debug: process.env.NODE_ENV === 'development',
};
