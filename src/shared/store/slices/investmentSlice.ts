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
  return_type: string;
  initial_amount: string;
  is_creator: boolean;
  is_participant: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_pause: boolean;
  can_resume: boolean;
  can_complete: boolean;
  performance: InvestmentPerformance;
  created_at: string;
  updated_at: string;
  recent_payouts: {
    map: any;
    id: number;
    amount: string;
    due_date: string;
    status: string;
  };
}
export interface InvestmentPerformance {
    total_paid_out: number;
    pending_payouts: number;
    next_payout_date: string | null;
    completion_percentage: number;
}
// Pagination metadata for investments
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number; // ✅ Total number of investments
  from: number;
  to: number;
  has_more_pages: boolean;
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
  // Pagination metadata
  meta:{
    pagination: PaginationMeta;
  };
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
  meta: {
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0, // Total number of investments
      from: 1,
      to: 10,
      has_more_pages: false,
    },
  },
  // Current investment details
  currentInvestment: null,
};



// Create Investment Slice
export const addInvestments = createAsyncThunk(
  "v1/investments",
  async (newInvestment: Investment, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.INVESTMENTS.CREATE, newInvestment);
      console.log("📦 Investment Created:", response.data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Create failed");
    }
  }
)


// 1️⃣ Fetch investments from API
export const fetchInvestments = createAsyncThunk(
  "/v1/investments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.INVESTMENTS.LIST);
      console.log("📦 Investments API Response:", response.data);
      const investments = response.data?.data || [];
      const total = response.data?.meta?.pagination?.total || 0;

      await storage.setItem(StorageKeys.INVESTMENTS_CACHE, {investments,total});
      return {investments,total};
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

      // reducers for adding investments
      .addCase(addInvestments.pending, (state)=>{
        state.isLoading = true;
      })
      .addCase(addInvestments.fulfilled, (state, action)=>{
        state.isLoading= false;
        state.investments.push(action.payload);
      })
      .addCase(addInvestments.rejected, (state,action)=>{
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // reducers for fetching investments
      .addCase(fetchInvestments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        state.investments = action.payload.investments;
        state.isLoading = false;
        // For total investments from meta data
        // const total= state.meta.pagination.total;
        // const total = state.meta.pagination.total = action.payload.length;
        const active = action.payload.investments.filter(
          (inv: Investment) => inv.status === "active"
        ).length;
        // const avgROI =
        //   action.payload.reduce(
        //     (sum: number, inv: { expected_return_rate: any }) =>
        //       sum + parseFloat(inv.expected_return_rate || 0),
        //     0
        //   ) / total || 0;
        //  ✅ NEW: Calculate total amount invested from initial_amounts
        const totalAmountInvested = action.payload.investments.reduce(
          (sum: number, inv: { initial_amount: any }) =>
            sum + parseFloat(inv.initial_amount || "0"),
          0
        );

        // Data to be shown and used in investment screen
        const initialAmount = action.payload.initial_amount;
        state.stats = {
          total_investments: action.payload.total,
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
