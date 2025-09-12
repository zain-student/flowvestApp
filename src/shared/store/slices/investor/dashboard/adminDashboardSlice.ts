import { API_ENDPOINTS } from "@/config/env";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@shared/services/api"; // Axios instance

// 🔹 Types
export interface Overview {
  total_investments: number;
  active_investments: number;
  total_partners: number;
  total_payouts_scheduled: number;
  overdue_payouts: number;
  total_payout_amount: string;
  this_month_payouts: string;
  roi_average: number;
}

export interface RecentActivity {
  id: number;
  type: string;
  description: string;
  user: string;
  timestamp: string;
}

export interface UpcomingPayout {
  id: number;
  amount: string;
  partner: string;
  investment: string;
  due_date: string;
}

export interface InvestmentPerformance {
  investment_type: string;
  total_invested: number;
  current_value: number;
  roi_percentage: number;
}

export interface AdminDashboardState {
  overview: Overview | null;
  recent_activities: RecentActivity[];
  upcoming_payouts: UpcomingPayout[];
  investment_performance: InvestmentPerformance[];
  isLoading: boolean;
  error: string | null;
}

// 🔹 Initial State
const initialState: AdminDashboardState = {
  overview: null,
  recent_activities: [],
  upcoming_payouts: [],
  investment_performance: [],
  isLoading: false,
  error: null,
};

// 🔹 Async thunk
export const fetchAdminDashboard = createAsyncThunk( 
  "adminDashboard/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.DASHBOARD.ADMIN
      );
      console.log("📊 Admin Dashboard Response:", response.data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

// 🔹 Slice
const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    resetDashboard(state) {
      state.overview = null;
      state.recent_activities = [];
      state.upcoming_payouts = [];
      state.investment_performance = [];
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.overview = action.payload.overview;
        state.recent_activities = action.payload.recent_activities;
        state.upcoming_payouts = action.payload.upcoming_payouts;
        state.investment_performance = action.payload.investment_performance;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetDashboard } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
