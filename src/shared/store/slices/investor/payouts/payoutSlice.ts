// @features/payout/payoutSlice.ts
import { API_ENDPOINTS } from "@/config/env";
import { showToast } from "@/modules/auth/utils/showToast";
import { storage, StorageKeys } from "@/shared/services/storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@shared/services/api"; // Adjust the path as per your structure

export interface CalculationBase {
  method: string; // "fixed" | "percentage"
  base_amount: string; // keeping as string since backend sends it as string
  calculated_at: string;
}

export interface Payout {
  id: number;
  investment_title: string;
  investment_id: number;
  participant_name: string;
  participant_email: string;
  amount: number;
  currency: {
    id: number;
    code: string;
    symbol: string;
    name: string;
    locale: string;
    decimal_places: number;
  };
  status: "scheduled" | "paid" | "overdue" | "cancelled"; // adjust if backend has more
  payout_type: "regular" | "bonus"; // add other types if exist
  scheduled_date: string;
  paid_date: string | null;
  payment_method: string;
  reference_number: string;
  notes: string | null;
  created_at: string;
  investment_roi: string; // backend sends as string
  participant_investment: number;
  participant_share: number;
  calculation_base: CalculationBase;
}
interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
export interface PayoutStats {
  total_payouts: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  missed_amount: number;

  by_status: {
    [key: string]: {
      status: string;
      count: number;
      total_amount: string;
    };
  };

  by_type: {
    [key: string]: {
      payout_type: string;
      count: number;
      total_amount: string;
      status: string;
    };
  };

  monthly_trends: {
    month: string; // "2026-02"
    count: number;
    total_amount: string;
    status: string;
    payout_type: string;
  }[];
}
interface summary {
  total_payouts: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
}
export interface PayoutsResponse {
  success: boolean;
  message: string;
  data: {
    payouts: Payout[];
    pagination: Pagination;
  };
}
interface PayoutState {
  payouts: Payout[];
  stats: PayoutStats | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  // totalPayoutAmount: number;
  currentPayout: Payout | null;
  pagination: Pagination;
}

const initialState: PayoutState = {
  payouts: [],
  stats: null,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  // totalPayoutAmount: 0,
  currentPayout: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  },
};
export const fetchPayoutStats = createAsyncThunk<
  PayoutStats,
  void,
  { rejectValue: string }
>("payouts/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(API_ENDPOINTS.PAYOUTS.STATISTICS);

    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch payout stats",
    );
  }
});
// Async thunk to fetch payouts
export const fetchPayouts = createAsyncThunk<
  { payouts: Payout[]; pagination: Pagination; page: number },
  number | void,
  { rejectValue: string }
>("v1/payouts/managed", async (page = 1, { rejectWithValue }) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.PAYOUTS.LIST}?page=${page}`,
    );

    const payouts = response.data?.data?.payouts || [];
    const pagination = response.data?.data?.pagination || {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
    };
    await storage.setItem(StorageKeys.PAYOUTS_CACHE, {
      payouts,
      pagination,
      page,
    });

    return { payouts, pagination, page };
  } catch (error: any) {
    const cached = await storage.getItem(StorageKeys.PAYOUTS_CACHE);
    if (cached) return cached;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch payouts",
    );
  }
});

//  Payout Details
export const fetchPayoutsById = createAsyncThunk(
  "v1/payouts/managed/:id",
  async (id: number) => {
    const response = await api.get(API_ENDPOINTS.PAYOUTS.DETAIL(id));

    return response.data.data;
  },
);
// Mark Payout as Paid
export const markPayoutAsPaid = createAsyncThunk(
  "payouts/markAsPaid",
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const response = await api.put(API_ENDPOINTS.PAYOUTS.MARK_PAID(id), data);

      return response.data.data.payout;
    } catch (error: any) {
      showToast(error.message, "error");
      return rejectWithValue(
        error.response?.data.message || "Failed to mark payout as paid",
      );
    }
  },
);
// Bulk Update Payouts
export const bulkUpdatePayouts = createAsyncThunk(
  "payouts/bulkUpdatePayouts",
  async (
    payload: {
      payout_ids: number[];
      status: string;
      payment_method: string;
      reference_number: string;
      notes?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.PAYOUTS.BULK_MARK_PAID,
        payload,
      );

      showToast(response.data.message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to bulk update payouts",
      );
    }
  },
);

// Cancel Payout
// slice.ts
export const cancelPayout = createAsyncThunk<
  { id: number }, // what we resolve back to reducers
  number, // payload we accept (payoutId)
  { rejectValue: string }
>("v1/payouts/cancel", async (payoutId, { rejectWithValue }) => {
  try {
    const response = await api.delete(API_ENDPOINTS.PAYOUTS.CANCEL(payoutId));

    if (!response.data?.success) {
      return rejectWithValue(
        response.data?.message || "Failed to cancel payout",
      );
    }

    showToast("Payout Cancelled successfully");
    return { id: payoutId };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to cancel payout",
    );
  }
});

// Slice
const payoutSlice = createSlice({
  name: "payout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayoutStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPayoutStats.fulfilled, (state, action) => {
        state.stats = action.payload; // ✅ Direct assign
        state.isLoading = false;
      })
      .addCase(fetchPayoutStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      //reducers for Fetchpayouts
      .addCase(fetchPayouts.pending, (state, action) => {
        const page = typeof action.meta.arg === "number" ? action.meta.arg : 1;
        if (page > 1) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchPayouts.fulfilled, (state, action) => {
        const { payouts, pagination, page } = action.payload;
        state.pagination = pagination;
        if (page > 1) {
          // Remove duplicates by id
          const existingIds = new Set(state.payouts.map((p) => p.id));
          const newPayouts = payouts.filter((p) => !existingIds.has(p.id));
          state.payouts = [...state.payouts, ...newPayouts];
        } else {
          state.payouts = payouts;
        }
        // state.totalPayoutAmount = state.payouts.reduce(
        //   (sum: number, payout: Payout) => sum + payout.amount,
        //   0,
        // );
        state.isLoading = false;
        state.isLoadingMore = false;
      })
      .addCase(fetchPayouts.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = (action.payload as string) || "Something went wrong";
      })
      // reducers for payout details
      .addCase(fetchPayoutsById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPayoutsById.fulfilled, (state, action) => {
        state.currentPayout = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPayoutsById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // reducers for cancel payout
      .addCase(cancelPayout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelPayout.fulfilled, (state, action) => {
        const { id } = action.payload;
        const payout = state.payouts.find((p) => p.id === id);
        if (payout) {
          payout.status = "cancelled";
        }
        if (state.currentPayout?.id === id) {
          state.currentPayout = {
            ...state.currentPayout,
            status: "cancelled",
          };
        }
        state.isLoading = false;
      })

      .addCase(cancelPayout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // reducers for mark payout as paid
      .addCase(markPayoutAsPaid.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(markPayoutAsPaid.fulfilled, (state, action) => {
        // state.isLoading = false;
        // state.currentPayout = action.payload;
        const { id } = action.payload;

        // Find the payout inside the list
        const payout = state.payouts.find((p) => p.id === id);
        if (payout) {
          payout.status = "paid"; // ✅ Update status to paid
        }
        // End loading state
        state.isLoading = false;
      })
      .addCase(markPayoutAsPaid.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // reducers for bulk update payouts
      .addCase(bulkUpdatePayouts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bulkUpdatePayouts.fulfilled, (state, action) => {
        const updatedIds = action.meta.arg.payout_ids;
        state.payouts = state.payouts.map((payout) =>
          updatedIds.includes(payout.id)
            ? { ...payout, status: "paid" }
            : payout,
        );
        state.isLoading = false;
      })
      .addCase(bulkUpdatePayouts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default payoutSlice.reducer;
