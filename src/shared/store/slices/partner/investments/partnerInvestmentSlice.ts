// store/partnerInvestmentSlice.ts
import { API_ENDPOINTS } from "@/config/env";
import { StorageKeys, storage } from "@/shared/services/storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@shared/services/api"; // Axios instance
import { ToastAndroid } from "react-native";

export interface PartnerInvestment {
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
  total_target_amount?: string;
  min_investment_amount?: string;
  max_investment_amount?: string;
  current_total_invested?: string;
  total_participants?: number;

  // ✅ New participant-specific fields
  my_investment?: string;
  my_participation_percentage?: string;
  my_expected_returns?: string;
  joined_at?: string;
  can_leave?: boolean;

  is_creator: boolean;
  is_participant: boolean;
  can_join: boolean;
  can_join_as_admin: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_pause: boolean;
  can_resume: boolean;
  can_complete: boolean;

  performance: {
    total_paid_out: number;
    pending_payouts: number;
    next_payout_date: string | null;
    completion_percentage: number;
  };

  participants_summary?: {
    total_count: number;
    active_count: number;
    average_investment: number | null;
  };

  created_at: string;
  updated_at: string;
}

export interface summary {
  total_investments: number;
  active_investments: number;
  total_invested: number;
  current_value: number;
  average_roi: number;
}

export interface PartnerInvestmentState {
  investments: PartnerInvestment[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  summary: summary;
  currentInvestment?: PartnerInvestment | null;
  meta: {
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
      has_more_pages: boolean;
    };
  };
}

const initialState: PartnerInvestmentState = {
  investments: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  summary: {
    total_investments: 0,
    active_investments: 0,
    total_invested: 0,
    current_value: 0,
    average_roi: 0,
  },
  meta: {
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0,
      has_more_pages: false,
    },
  },
  currentInvestment: null,
};

// 🔹 Fetch Partner Investments
export const fetchPartnerParticipatingInvestments = createAsyncThunk(
  "/v1/partner/investments/participating",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.INVESTMENTS.LIST}?scope=participating&page=${page}`
      );

      const investments = response.data?.data || [];
      const meta = response.data?.meta || {};
      const summary = response.data?.summary || {};

      // Cache in local storage
      await storage.setItem(StorageKeys.INVESTMENTS_CACHE, {
        investments,
        meta,
        summary,
        page,
      });
      ToastAndroid.show("Investments data cached", ToastAndroid.SHORT);
console.log("Fetched investments:", investments);
      return { investments, meta, summary, page };
    } catch (error: any) {
      const cached = await storage.getItem(StorageKeys.INVESTMENTS_CACHE);
      if (cached) return cached;
      return rejectWithValue(error?.response?.data?.message || "Fetch failed");
    }
  }
);

// 🔹 Fetch Partner Investment By ID
// export const fetchPartnerInvestmentById = createAsyncThunk(
//   "/v1/partner/investments/:id",
//   async (id: number, { rejectWithValue }) => {
//     try {
//       const response = await api.get(API_ENDPOINTS.INVESTMENTS.DETAIL(id));
//       return response.data.data;
//     } catch (error: any) {
//       return rejectWithValue(error?.response?.data?.message || "Fetch failed");
//     }
//   }
// );

const partnerInvestmentSlice = createSlice({
  name: "partnerInvestments",
  initialState,
  reducers: {
    resetPartnerInvestments(state) {
      state.investments = [];
      state.meta.pagination.current_page = 1;
      state.meta.pagination.has_more_pages = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch partner investments
      .addCase(fetchPartnerParticipatingInvestments.pending, (state, action) => {
        const page = action.meta.arg;
        if (page > 1) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchPartnerParticipatingInvestments.fulfilled, (state, action) => {
        const { investments, meta, page, summary } = action.payload;

        state.meta = meta;

        if (page > 1) {
          const existingIds = new Set(state.investments.map((inv) => inv.id));
          const newInvestments = investments.filter(
            (inv: { id: number }) => !existingIds.has(inv.id)
          );
          state.investments = [...state.investments, ...newInvestments];
        } else {
          state.investments = investments;
        }

        state.summary = {
          total_investments: summary?.total_investments ?? 0,
          active_investments: summary?.active_investments ?? 0,
          total_invested: summary?.total_invested ?? 0,
          current_value: summary?.current_value ?? 0,
          average_roi: summary?.average_roi ?? 0,
        };

        state.isLoading = false;
        state.isLoadingMore = false;
      })
      .addCase(fetchPartnerParticipatingInvestments.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = action.payload as string;
      })

      // Fetch partner investment by ID
    //   .addCase(fetchPartnerInvestmentById.pending, (state) => {
    //     state.isLoading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchPartnerInvestmentById.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     state.currentInvestment = action.payload;
    //   })
    //   .addCase(fetchPartnerInvestmentById.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.error = action.payload as string;
    //   });
  },
});

export const { resetPartnerInvestments } = partnerInvestmentSlice.actions;
export default partnerInvestmentSlice.reducer;
