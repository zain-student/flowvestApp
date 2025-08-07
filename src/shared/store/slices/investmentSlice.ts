// store/investmentSlice.ts
import { API_ENDPOINTS } from "@/config/env";
import { StorageKeys, storage } from "@/shared/services/storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@shared/services/api"; // Axios instance

export interface Investment {
  id: number;
  name: string;
  description: string;
  type: string;
  frequency: string;
  expected_return_rate: string;
  start_date: string;
  end_date: string;
  status: string;
  initial_amount: string;
  performance: {
    total_paid_out: number;
    pending_payouts: number;
    next_payout_date: string | null;
    completion_percentage: number;
  };
  recent_payouts: {
    map: any;
    id: number;
    amount: string;
    due_date: string;
    status: string;
  };
}
export interface InvestmentStats {
  total_investments: number;
  active_investments: number;
  total_partners: number;
  roi_average: number;
  total_invested_amount: number;
  // for investments screen
  initial_amount: number;
}
export interface InvestmentState {
  investments: Investment[];
  isLoading: boolean;
  error: string | null;
  stats: InvestmentStats;
  currentInvestment?: Investment | null;
}

const initialState: InvestmentState = {
  investments: [],
  isLoading: false,
  error: null,
  stats: {
    total_investments: 0,
    active_investments: 0,
    total_partners: 0,
    roi_average: 0,
    total_invested_amount: 0,
    // for investments screen
    initial_amount: 0,
  },
  currentInvestment: null,
};

// 1️⃣ Fetch investments from API
export const fetchInvestments = createAsyncThunk(
  "/v1/investments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.INVESTMENTS.LIST);
      console.log("📦 Investments API Response:", response.data);
      const investments = response.data?.data || [];
      await storage.setItem(StorageKeys.INVESTMENTS_CACHE, investments);
      return investments;
    } catch (error: any) {
      const cached = await storage.getItem(StorageKeys.INVESTMENTS_CACHE);
      if (cached) return cached;
      return rejectWithValue(error?.response?.data?.message || "Fetch failed");
    }
  }
);
//  Investment Details
export const fetchInvestmentsById = createAsyncThunk(
  "v1/investments/:investmentId",
  async (id: string) => {
    const response = await api.get(API_ENDPOINTS.INVESTMENTS.DETAIL(id));
    console.log("Investment detail is :",response.data);
    return response.data.data;
  }
);
const investmentSlice = createSlice({
  name: "investments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        state.investments = action.payload;
        state.isLoading = false;
        const total = action.payload.length;
        const active = action.payload.filter(
          (inv: Investment) => inv.status === "active"
        ).length;
        const avgROI =
          action.payload.reduce(
            (sum: number, inv: { expected_return_rate: any }) =>
              sum + parseFloat(inv.expected_return_rate || 0),
            0
          ) / total || 0;
        //  ✅ NEW: Calculate total amount invested from initial_amounts
        const totalAmountInvested = action.payload.reduce(
          (sum: number, inv: { initial_amount: any }) =>
            sum + parseFloat(inv.initial_amount || "0"),
          0
        );

        // Data to be shown and used in investment screen
        const initialAmount = action.payload.initial_amount;
        state.stats = {
          total_investments: total,
          active_investments: active,
          roi_average: 0,
          total_partners: 0,
          total_invested_amount: totalAmountInvested,
          // For investments screen
          initial_amount: initialAmount,
        };
      })
      .addCase(fetchInvestments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // reducers for investment details
      .addCase(fetchInvestmentsById.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvestmentsById.fulfilled, (state, action) => {
        state.currentInvestment = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchInvestmentsById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default investmentSlice.reducer;
