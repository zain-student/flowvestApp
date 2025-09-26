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
export interface JoinInvestmentPayload {
  investmentId: number;
  amount: number;
  notes: string;
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
  sharedPrograms: {
    list: PartnerInvestment[]; // reuse PartnerInvestment type
    isLoading: boolean;
    error: string | null;
  };
  join: {
    isJoining: boolean;
    error: string | null;
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
  sharedPrograms: {
    list: [],
    isLoading: false,
    error: null,
  },
  join: {
    isJoining: false,
    error: null,
  },
};

//  Fetch Partner Investments
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
export const fetchAvailableSharedPrograms = createAsyncThunk(
  "/v1/shared-programs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.INVESTMENTS.SHARED_AVAILABLE
      );
      // assuming API returns { success, message, data: [...] }
      console.log("Fetched shared programs:", response.data?.data);
      return response.data?.data || [];
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch shared programs"
      );
    }
  }
);
//  Join Investment Thunk
export const joinInvestment = createAsyncThunk(
  "/v1/investments/join",
  async (
    { investmentId, amount, notes }: JoinInvestmentPayload,
    { rejectWithValue }
  ) => {
    try {
      console.log("Joining investment:", investmentId, amount, notes);
      const response = await api.post(
        API_ENDPOINTS.INVESTMENTS.JOIN(investmentId), // ✅ clean call
        { amount, notes }
      );
      const joined = response.data?.data;
      if (!joined) {
        return rejectWithValue("Join investment failed: No data returned");
      }

      ToastAndroid.show(
        response.data?.message || "Investment joined successfully",
        ToastAndroid.SHORT
      );
      console.log("✅ Joined investment:", JSON.stringify(joined));

      return joined;
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to join investment";
      ToastAndroid.show(errMsg, ToastAndroid.SHORT);
      console.log("❌ Join investment error:", errMsg);
      return rejectWithValue(errMsg);
    }
  }
);
export const leaveInvestment = createAsyncThunk(
  "partnerInvestments/leaveInvestment",
  async (id: number, { rejectWithValue }) => {
    try {
      console.log("Leaving investment:", id);
      // Assuming the API endpoint for leaving an investment is as follows:
      const res = await api.delete(API_ENDPOINTS.INVESTMENTS.LEAVE(id));
      ToastAndroid.show(
        res.data?.message || "Successfully left the investment",
        ToastAndroid.SHORT
      );
      console.log("✅ Left investment:", id);
      console.log("Response:", res.data);
      return { id, message: res.data.message };
    } catch (err: any) {
       const errMsg =
       err?.response?.data?.message ||
        err?.message ||
        "Failed to leave investment";
      ToastAndroid.show(errMsg, ToastAndroid.SHORT);
      console.log("❌ Leave investment error:", errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

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
      .addCase(
        fetchPartnerParticipatingInvestments.pending,
        (state, action) => {
          const page = action.meta.arg;
          if (page > 1) {
            state.isLoadingMore = true;
          } else {
            state.isLoading = true;
          }
          state.error = null;
        }
      )
      .addCase(
        fetchPartnerParticipatingInvestments.fulfilled,
        (state, action) => {
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
        }
      )
      .addCase(
        fetchPartnerParticipatingInvestments.rejected,
        (state, action) => {
          state.isLoading = false;
          state.isLoadingMore = false;
          state.error = action.payload as string;
        }
      )
      // Fetch available shared programs
      .addCase(fetchAvailableSharedPrograms.pending, (state) => {
        state.sharedPrograms.isLoading = true;
        state.sharedPrograms.error = null;
      })
      .addCase(fetchAvailableSharedPrograms.fulfilled, (state, action) => {
        state.sharedPrograms.isLoading = false;
        state.sharedPrograms.list = action.payload;
      })
      .addCase(fetchAvailableSharedPrograms.rejected, (state, action) => {
        state.sharedPrograms.isLoading = false;
        state.sharedPrograms.error = action.payload as string;
      })
      // Join Investment
      .addCase(joinInvestment.pending, (state) => {
        state.join.isJoining = true;
        state.join.error = null;
      })
      // .addCase(joinInvestment.fulfilled, (state) => {
      //   state.join.isJoining = false;
      // })
      .addCase(joinInvestment.rejected, (state, action) => {
        state.join.isJoining = false;
        state.join.error = action.payload as string;
      })
      .addCase(joinInvestment.fulfilled, (state, action) => {
        state.join.isJoining = false;

        const participant = action.payload?.participant;
        const updatedInvestment = participant?.investment;

        if (updatedInvestment) {
          // Update in both investments and sharedPrograms lists
          const updateList = (list: PartnerInvestment[]) =>
            list.map((inv) =>
              inv.id === updatedInvestment.id
                ? {
                    ...inv,
                    ...updatedInvestment,
                    is_participant: true,
                    my_investment: participant.invested_amount,
                    joined_at: participant.joined_at,
                  }
                : inv
            );

          state.sharedPrograms.list = updateList(state.sharedPrograms.list);
          state.investments = updateList(state.investments);
        }
      })
      // Leave Investment
      .addCase(leaveInvestment.fulfilled, (state, action) => {
        state.investments = state.investments.filter(
          (inv) => inv.id !== action.payload.id
        );
      })
      .addCase(leaveInvestment.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(leaveInvestment.pending, (state) => {
        state.error = null;
      });
  },
});

export const { resetPartnerInvestments } = partnerInvestmentSlice.actions;
export default partnerInvestmentSlice.reducer;
