/**
 * Root Reducer
 * Combines all module reducers into a single root reducer
 */

import { combineReducers } from '@reduxjs/toolkit';

// Import module reducers (will be created gradually)
import adminDashboardSlice from "@/shared/store/slices/investor/dashboard/adminDashboardSlice";
import investmentSlice from '@/shared/store/slices/investor/investments/investmentSlice';
import authSlice from '../../modules/auth/store/authSlice';
import addPartnerSlice from './slices/investor/dashboard/addPartnerSlice';
import payoutSlice from './slices/investor/payouts/payoutSlice';
import portfolioSlice from './slices/investor/portfolio/portfolioSlice';
import profileSlice from './slices/profile/profileSlice';
// import notificationSlice from '../../modules/notifications/store/notificationSlice';
import partnerInvestmentSlice from './slices/partner/investments/partnerInvestmentSlice';
import PartnerPayoutSlice from './slices/partner/payout/PartnerPayoutSlice';
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
  portfolio: portfolioSlice,
  profile: profileSlice,
  // notifications: notificationSlice,
  userInvestments: partnerInvestmentSlice,
  userPayouts: PartnerPayoutSlice,
  // Shared/Global state (will be created later)
  // theme: themeSlice,
  // loading: loadingSlice,
  // errors: errorSlice,
  // network: networkSlice,
});

export type RootState = ReturnType<typeof rootReducer>; 