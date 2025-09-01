/**
 * Root Reducer
 * Combines all module reducers into a single root reducer
 */

import { combineReducers } from '@reduxjs/toolkit';

// Import module reducers (will be created gradually)
import adminDashboardSlice from "@/shared/store/slices/adminDashboardSlice";
import investmentSlice from '@/shared/store/slices/investmentSlice';
import authSlice from '../../modules/auth/store/authSlice';
import addPartnerSlice from '../store/slices/addPartnerSlice';
import payoutSlice from '../store/slices/payoutSlice';
// import portfolioSlice from '../../modules/portfolio/store/portfolioSlice';
// import profileSlice from '../../modules/profile/store/profileSlice';
// import notificationSlice from '../../modules/notifications/store/notificationSlice';

// Import shared reducers
// import themeSlice from './slices/themeSlice';
// import loadingSlice from './slices/loadingSlice';
// import errorSlice from './slices/errorSlice';
// import networkSlice from './slices/networkSlice';

export const rootReducer = combineReducers({
  // Authentication
  auth: authSlice,
  partner: addPartnerSlice,
  investments: investmentSlice,
  // Module reducers (will be uncommented as we create them)
  dashboard: adminDashboardSlice,
  payout: payoutSlice,
  // portfolio: portfolioSlice,
  // profile: profileSlice,
  // notifications: notificationSlice,
  
  // Shared/Global state (will be created later)
  // theme: themeSlice,
  // loading: loadingSlice,
  // errors: errorSlice,
  // network: networkSlice,
});

export type RootState = ReturnType<typeof rootReducer>; 