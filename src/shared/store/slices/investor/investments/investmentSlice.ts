// store/investmentSlice.ts
import { API_ENDPOINTS } from "@/config/env";
import { StorageKeys, storage } from "@/shared/services/storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@shared/services/api"; // Axios instance
import { ToastAndroid } from "react-native";

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
  isLoading: boolean; // For initial fetch
  isLoadingMore: boolean; // For pagination
  error: string | null;
  stats: InvestmentStats;
  currentInvestment?: Investment | null;
  // Pagination metadata
  meta: {
    pagination: PaginationMeta;
  };
}

const initialState: InvestmentState = {
  investments: [],
  isLoading: false,
  isLoadingMore: false,
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
      per_page: 15,
      total: 0, // Total number of investments
      from: 0,
      to: 0,
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
      const response = await api.post(
        API_ENDPOINTS.INVESTMENTS.CREATE,
        newInvestment
      );
      console.log("📦 Investment Created:", response.data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error || "Create failed");
    }
  }
);

// Fetch Investments with Pagination
// This will fetch the first page by default, or a specific page if provided
export const fetchInvestments = createAsyncThunk(
  "/v1/investments",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.INVESTMENTS.LIST}?page=${page}`
      );
      console.log("📦 Investments API Response:", response.data);
      const investments = response.data?.data || [];
      const meta = response.data?.meta || {};

      await storage.setItem(StorageKeys.INVESTMENTS_CACHE, {
        investments,
        meta,
        page,
      });
      return { investments, meta, page };
    } catch (error: any) {
      const cached = await storage.getItem(StorageKeys.INVESTMENTS_CACHE);
      if (cached) return cached;
      return rejectWithValue(error?.response?.data?.message || "Fetch failed");
    }
  }
);

//  Investment Details
export const fetchInvestmentsById = createAsyncThunk(
  "v1/investments/:id",
  async (id: number) => {
    const response = await api.get(API_ENDPOINTS.INVESTMENTS.DETAIL(id));
    console.log("Investment detail is :", response.data);
    return response.data.data;
  }
);
// Duplicate Investment
export const duplicateInvestment = createAsyncThunk(
  "v1/investments/:id/duplicate",
  async ({ investmentId }: { investmentId: number }, { rejectWithValue }) => {
    try {
      console.log("Duplicate called for ID:", investmentId);
      const response = await api.post(
        API_ENDPOINTS.INVESTMENTS.DUPLICATE(investmentId)
      );
      console.log("Investment Duplicated:", response.data);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      return response.data.data;
    } catch (error: any) {
      ToastAndroid.show(
        error.message || "Duplication failed",
        ToastAndroid.SHORT
      );
      return rejectWithValue(error || "Duplication failed");
    }
  }
);
// Update Investment
export const updateInvestment = createAsyncThunk(
  "v1/investments/update",
  async (
    { id, updatedData }: { id: number; updatedData: Partial<Investment> },
    { rejectWithValue }
  ) => {
    try {
      console.log("Update called");
      const response = await api.put(
        API_ENDPOINTS.INVESTMENTS.UPDATE(id),
        updatedData
      );
      console.log("📦 Investment Updated:", response.data);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error || "Update failed");
    }
  }
);
// Delete Investment
export const deleteInvestment = createAsyncThunk(
  "v1/investments/delete",
  async ({ investmentId }: { investmentId: number }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        API_ENDPOINTS.INVESTMENTS.DELETE(investmentId)
      );
      console.log("Investment deleted successfully:", response.data);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      return investmentId;
    } catch (error: any) {
      //  console.error("Full error object:", error);
      // console.error("Error response:", error.message);

      return rejectWithValue(error || "Delete failed");
    }
  }
);

// Update Investment
const investmentSlice = createSlice({
  name: "investments",
  initialState,
  reducers: {
    resetInvestments(state) {
      state.investments = [];
      state.meta.pagination.current_page = 1;
      state.meta.pagination.has_more_pages = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // reducers for adding investments
      .addCase(addInvestments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addInvestments.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.investments.push(action.payload);
        state.investments = [action.payload, ...state.investments];
        if (state.stats && typeof state.stats.total_investments === "number") {
          state.stats.total_investments += 1;
        }
        if (
          action.payload.status === "active" &&
          state.stats?.active_investments !== undefined
        ) {
          state.stats.active_investments += 1;
        }
      })
      .addCase(addInvestments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // reducers for fetching investments
      .addCase(fetchInvestments.pending, (state, action) => {
        const page = action.meta.arg;
        if (page > 1) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }

        // state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        const { investments, meta, page } = action.payload;

        // state.isLoading = false;
        state.meta = meta; // full pagination meta from backend

        if (page > 1) {
          // Remove duplicates by id
          const existingIds = new Set(state.investments.map((p) => p.id));
          const newInvestments = investments.filter(
            (p: { id: number }) => !existingIds.has(p.id)
          );
          // Append to existing data
          state.investments = [...state.investments, ...newInvestments];
        } else {
          // Replace for first page
          state.investments = investments;
        }

        // ✅ Always use backend total for total investments
        const totalFromBackend =
          meta?.pagination?.total || state.investments.length;

        // ✅ Active count from all accumulated investments
        const activeCount = state.investments.filter(
          (inv) => inv.status === "active"
        ).length;

        // ✅ Calculate total amount invested
        const totalAmountInvested = state.investments.reduce(
          (sum, inv) => sum + parseFloat(inv.initial_amount || "0"),
          0
        );

        state.stats = {
          total_investments: totalFromBackend,
          active_investments: activeCount,
          roi_average: 0, // you can calculate this later
          total_partners: 0,
          total_invested_amount: totalAmountInvested,
          initial_amount: 0, // not clear from your API what this should be
        };
        state.isLoading = false;
        state.isLoadingMore = false;
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
        state.isLoading = false;
        state.currentInvestment = action.payload;
      })
      .addCase(fetchInvestmentsById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // reducers for duplicating investments
      .addCase(duplicateInvestment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(duplicateInvestment.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add new duplicated investment at top of list
        state.investments = [action.payload, ...state.investments];

        // Update stats
        if (state.stats && typeof state.stats.total_investments === "number") {
          state.stats.total_investments += 1;
        }
        if (
          action.payload.status === "active" &&
          state.stats?.active_investments !== undefined
        ) {
          state.stats.active_investments += 1;
        }
      })
      .addCase(duplicateInvestment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // reducers for updating investments
      .addCase(updateInvestment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateInvestment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.investments = state.investments.map((inv) =>
          inv.id === action.payload.id ? { ...inv, ...action.payload } : inv
        );

        if (state.currentInvestment?.id === action.payload.id) {
          state.currentInvestment = {
            ...state.currentInvestment,
            ...action.payload,
          };
        }
      })

      .addCase(updateInvestment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // reducers for deleting investments
      .addCase(deleteInvestment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteInvestment.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted investment from the list
        const deletedId = action.payload;
        state.investments = state.investments.filter(
          (inv) => inv.id !== Number(deletedId)
        );
        // Clear current investment if deleted one was open
        if (state.currentInvestment?.id === Number(deletedId)) {
          state.currentInvestment = null;
        }
        if (state.stats && typeof state.stats.total_investments === "number") {
          state.stats.total_investments -= 1;
        }
      })
      .addCase(deleteInvestment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});
export const { resetInvestments } = investmentSlice.actions;
export default investmentSlice.reducer;
