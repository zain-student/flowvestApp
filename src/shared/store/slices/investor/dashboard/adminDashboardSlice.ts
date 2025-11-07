import { API_ENDPOINTS } from "@/config/env";
import { api } from "@/shared/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ToastAndroid } from "react-native";

interface DashboardStats {
  total_managed_portfolio: number;
  portfolio_change: number;
  portfolio_change_type: "positive" | "negative";
  active_investments: number;
  new_investments_this_month: number;
  partner_returns: number;
  partner_returns_change: number;
  partner_returns_change_type: "positive" | "negative";
  pending_payouts: number;
  pending_payouts_count: number;
  total_partners: number;
  new_partners_this_month: number;
  roi_average: number;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  amount: string;
  time: string;
  status: string;
  created_at: string;
}

interface AdminDashboardState {
  isLoading: boolean;
  error: string | null;
  stats: DashboardStats | null;
  recent_activities: ActivityItem[];
}

const initialState: AdminDashboardState = {
  isLoading: false,
  error: null,
  stats: null,
  recent_activities: [],
};

export const fetchAdminDashboard = createAsyncThunk(
  "adminDashboard/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD.ADMIN_DASHBOARD);
      console.log("Dashboard data:" ,response.data)
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to load dashboard data"
      );
    }
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats || null;
        state.recent_activities = action.payload.recent_activities || [];
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        ToastAndroid.show(state.error, ToastAndroid.SHORT);
      });
  },
});

export default adminDashboardSlice.reducer;
