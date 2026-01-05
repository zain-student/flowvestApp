// src/features/portfolio/portfolioSlice.ts
import { API_ENDPOINTS } from "@/config/env";
// import { storage, StorageKeys } from "@/shared/services/storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@shared/services/api"; // Adjust the path as per your structure
import { ToastAndroid } from "react-native";

export interface PortfolioSummary {
  total_investments: number;
  total_invested: number;
  total_earned: number;
  total_pending: number;
  roi_percentage: number;
  active_investments: number;
}

export interface InvestmentPerformance {
  total_paid_out: number;
  pending_payouts: number;
  next_payout_date: string | null;
  completion_percentage: number;
}

export interface InvestmentMetadata {
  paused_at?: string;
  paused_by?: number;
  resumed_at?: string;
  resumed_by?: number;
  pause_reason?: string;
  resume_reason?: string;
  notes?: string | null;
  investment_type_id?: number;
}

export interface Investment {
  id: number;
  name: string;
  description: string;
  type: string;
  status: string;
  return_type: string;
  frequency: string;
  start_date: string;
  end_date: string;
  expected_return_rate: string;
  initial_amount: string;
  current_total_invested: string;
  is_creator: boolean;
  is_participant: boolean;
  can_join_as_admin: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_pause: boolean;
  can_resume: boolean;
  can_complete: boolean;
  performance: InvestmentPerformance;
  metadata?: InvestmentMetadata;
  created_at: string;
  updated_at: string;
}

export interface PortfolioPerformancePeriod {
  roi_percentage: number;
  total_earned: number;
}

export interface PortfolioPerformance {
  all_time: PortfolioPerformancePeriod;
  year: PortfolioPerformancePeriod;
  quarter: PortfolioPerformancePeriod;
  month: PortfolioPerformancePeriod;
}

export interface PortfolioData {
  summary: PortfolioSummary;
  own_investments: Investment[];
  participations: any[];
  upcoming_payouts: any[];
  performance: PortfolioPerformance;
}

export interface PortfolioResponse {
  success: boolean;
  message: string;
  data: PortfolioData;
}

export interface PortfolioState {
  isLoading: boolean;
  error: string | null;
  data: PortfolioData | null;
}

const initialState: PortfolioState = {
  isLoading: false,
  error: null,
  data: null,
};

//    Async Thunks

export const fetchPortfolio = createAsyncThunk<
  PortfolioResponse,
  void,
  { rejectValue: string }
>("portfolio/fetchPortfolio", async (_, thunkAPI) => {
  try {
    const response = await api.get(API_ENDPOINTS.PORTFOLIO.INDEX);
    ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
    console.log("Portfolio api response:",response.data.data);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to fetch portfolio"
    );
  }
});

//    Slice

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default portfolioSlice.reducer;
