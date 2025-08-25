// @features/payout/payoutSlice.ts
import { API_ENDPOINTS } from "@/config/env";
import { storage, StorageKeys } from "@/shared/services/storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@shared/services/api"; // Adjust the path as per your structure
// Types
// export interface Payout {
//   id: number;
//   amount: number;
//   due_date: string;
//   status: string;
//   created_at: string;
//   updated_at: string;
//   [key: string]: any; // for any additional fields
// }
export interface Payout {
  id: number;
  amount: string;
  due_date: string;
  paid_date: string | null;
  status: string;
  payout_type: string;
  investment: {
    id: number;
    name: string;
    type: string;
  };
  notes: string | null;
  calculation_base: {
    method: string;
    base_amount: string;
    calculated_at: string;
  };
  can_mark_as_paid: boolean;
  can_cancel: boolean;
  can_reschedule: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}
interface PayoutState {
  payouts: Payout[];
  isloading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  totalPayoutAmount: number;
  currentPayout: Payout | null;
  meta: {
    pagination: PaginationMeta;
  };
}

const initialState: PayoutState = {
  payouts: [],
  isloading: false,
  isLoadingMore: false,
  error: null,
  totalPayoutAmount: 0,
  currentPayout: null,
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
};

// Async thunk to fetch payouts
export const fetchPayouts = createAsyncThunk<
  { payouts: Payout[]; meta: any; page: number },
  number | void,
  { rejectValue: string }
>("v1/payouts", async (page = 1, { rejectWithValue }) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.PAYOUTS.LIST}?page=${page}`
    );
    const payouts = response.data?.data || [];
    const meta = response.data?.meta || {};
    await storage.setItem(StorageKeys.PAYOUTS_CACHE, { payouts, meta, page });
    return { payouts, meta, page };
  } catch (error: any) {
    const cached = await storage.getItem(StorageKeys.PAYOUTS_CACHE);
    if (cached) return cached;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch payouts"
    );
  }
});

// export const fetchPayouts = createAsyncThunk<Payout[], void, { rejectValue: string }>(
//   "v1/payouts",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get(API_ENDPOINTS.PAYOUTS.LIST); // adjust endpoint
//       console.log("Payouts api response :", response.data);
//       const payouts = response.data?.data || [];
//       await storage.setItem(StorageKeys.PAYOUTS_CACHE, payouts);
//       return payouts;
//     } catch (error: any) {
//       const cached = await storage.getItem(StorageKeys.PAYOUTS_CACHE);
//       if (cached) return cached;
//         return rejectWithValue(error.response?.data?.message || "Failed to fetch payouts");
//     }
//   }
// );
//  Payout Details
export const fetchPayoutsById = createAsyncThunk(
  "v1/payouts/:investmentId",
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
          state.isloading = true;
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
        const { payouts, meta, page } = action.payload;
        state.meta = meta;
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
            sum + parseFloat(payout.amount || "0"),
          0
        );
        state.isloading = false;
        state.isLoadingMore = false;
      })
      .addCase(fetchPayouts.rejected, (state, action) => {
        state.isloading = false;
        state.isLoadingMore = false;
        state.error = (action.payload as string) || "Something went wrong";
      })
      // reducers for payout details
      .addCase(fetchPayoutsById.pending, (state, action) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(fetchPayoutsById.fulfilled, (state, action) => {
        state.currentPayout = action.payload;
        state.isloading = false;
      })
      .addCase(fetchPayoutsById.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload as string;
      });
  },
});

export default payoutSlice.reducer;
