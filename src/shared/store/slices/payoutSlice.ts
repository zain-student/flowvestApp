// @features/payout/payoutSlice.ts
import { API_ENDPOINTS } from "@/config/env";
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
  status: "scheduled" | "paid" | "overdue"; // adjust if backend has more
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
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  totalPayoutAmount: number;
  currentPayout: Payout | null;
  pagination: Pagination;
}

const initialState: PayoutState = {
  payouts: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  totalPayoutAmount: 0,
  currentPayout: null,
  pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
    },
};

// Async thunk to fetch payouts
export const fetchPayouts = createAsyncThunk<
  { payouts: Payout[]; pagination: Pagination; page: number },
  number | void,
  { rejectValue: string }
>("v1/payouts/managed", async (page = 1, { rejectWithValue }) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.PAYOUTS.LIST}?page=${page}`
    );
    const payouts = response.data?.data?.payouts || [];
    const pagination = response.data?.data?.pagination || {
      current_page:1,
      last_page:1,
      per_page:15,
      total:0,
    };
    await storage.setItem(StorageKeys.PAYOUTS_CACHE, { payouts, pagination, page });
    return { payouts, pagination, page };
  } catch (error: any) {
    const cached = await storage.getItem(StorageKeys.PAYOUTS_CACHE);
    if (cached) return cached;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch payouts"
    );
  }
});


//  Payout Details
export const fetchPayoutsById = createAsyncThunk(
  "v1/payouts/managed/:id",
  async (id: string) => {
    const response = await api.get(API_ENDPOINTS.PAYOUTS.DETAIL(id));
    console.log("Payout details is :", response.data);
    return response.data.data;
  }
);
// Slice
const payoutSlice = createSlice({
  name: "payout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // .addCase(fetchPayouts.pending, (state) => {
      //   state.isloading = true;
      //   state.error = null;
      // })
      // .addCase(fetchPayouts.fulfilled, (state, action) => {
      //   state.isloading = false;
      //   state.payouts = action.payload;
      //   // ✅ Calculate total payout amount here
      //   const totalAmount = action.payload.reduce(
      //     (sum: number, payout: Payout) =>
      //       sum + parseFloat(payout.amount || "0"),
      //     0
      //   );
      //   state.totalPayoutAmount = totalAmount;
      // })
      // .addCase(fetchPayouts.rejected, (state, action) => {
      //   state.isloading = false;
      //   state.error = action.payload as string || "Something went wrong";
      // })
      .addCase(fetchPayouts.pending, (state, action) => {
        const page = typeof action.meta.arg === "number" ? action.meta.arg : 1;
        if (page > 1) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      // .addCase(fetchPayouts.fulfilled, (state, action) => {
      //   const { payouts, meta, page } = action.payload;
      //   state.meta = meta;
      //   if (page > 1) {
      //     state.payouts = [...state.payouts, ...payouts];
      //   } else {
      //     state.payouts = payouts;
      //   }
      //   state.totalPayoutAmount = state.payouts.reduce(
      //     (sum: number, payout: Payout) => sum + parseFloat(payout.amount || "0"),
      //     0
      //   );
      //   state.isloading = false;
      //   state.isLoadingMore = false;
      // })
      .addCase(fetchPayouts.fulfilled, (state, action) => {
        const { payouts, pagination , page } = action.payload;
        state.pagination = pagination;
        if (page > 1) {
          // Remove duplicates by id
          const existingIds = new Set(state.payouts.map((p) => p.id)); 
          const newPayouts = payouts.filter((p) => !existingIds.has(p.id));
          state.payouts = [...state.payouts, ...newPayouts];
        } else {
          state.payouts = payouts;
        }
        state.totalPayoutAmount = state.payouts.reduce(
          (sum: number, payout: Payout) =>
            sum + payout.amount,
          0
        );
        state.isLoading = false;
        state.isLoadingMore = false;
      })
      .addCase(fetchPayouts.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = (action.payload as string) || "Something went wrong";
      })
      // reducers for payout details
      .addCase(fetchPayoutsById.pending, (state, action) => {
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
      });
  },
});

export default payoutSlice.reducer;
