// src/store/slices/partnerDashboardSlice.ts

import { API_ENDPOINTS } from "@/config/env";
import { api } from "@/shared/services/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for the API structure
interface Stats {
  portfolio_value: number;
  pending_payouts_count: number;
  active_investments: number;
  total_earned: number;
  roi_percentage: number;
}

interface RecentActivity {
  
  id: string;
  title: string;
  type: string; // e.g., "payout" | "investment"
  description: string;
  status: string; // e.g., "completed" | "processing"
  amount: string;
  time: string;
  created_at: string;
}

interface UpcomingPayout {
  id: number;
  investment_name: string;
  payout_date: string;
  amount: string;
}

interface PartnerDashboardData {
  stats: Stats;
  recent_activities: RecentActivity[];
  upcoming_payouts: UpcomingPayout[];
}

// Redux state interface
interface PartnerDashboardState {
  stats: Stats | null;
  recent_activities: RecentActivity[];
  upcoming_payouts: UpcomingPayout[];
  loading: boolean;
  error: string | null;
}

const initialState: PartnerDashboardState = {
  stats: null,
  recent_activities: [],
  upcoming_payouts: [],
  loading: false,
  error: null,
};

export const fetchPartnerDashboard = createAsyncThunk<
  PartnerDashboardData,
  void,
  { rejectValue: string }
>("partnerDashboard/fetchPartnerDashboard", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(API_ENDPOINTS.DASHBOARD.USER_DASHBOARD);
    console.log("✅ Partner Dashboard Data:", response.data);
    return response.data.data; // assuming response.data = { success, message, data }
  } catch (error: any) {
    return rejectWithValue(
      error.message || "Failed to fetch partner dashboard"
    );
  }
});

const partnerDashboardSlice = createSlice({
  name: "partnerDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartnerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPartnerDashboard.fulfilled,
        (state, action: PayloadAction<PartnerDashboardData>) => {
          state.loading = false;
          state.stats = action.payload?.stats ?? null;
          state.recent_activities = action.payload?.recent_activities ?? [];
          state.upcoming_payouts = action.payload?.upcoming_payouts ?? [];
        }
      )
      .addCase(fetchPartnerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default partnerDashboardSlice.reducer;
