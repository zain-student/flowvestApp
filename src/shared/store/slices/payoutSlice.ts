// @features/payout/payoutSlice.ts
import { API_ENDPOINTS } from "@/config/env";
import { storage, StorageKeys } from "@/shared/services/storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@shared/services/api"; // Adjust the path as per your structure
// Types
export interface Payout {
  id: number;
  amount: number;
  due_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  [key: string]: any; // for any additional fields
}

interface PayoutState {
  payouts: Payout[];
  isloading: boolean;
  error: string | null;
}

const initialState: PayoutState = {
  payouts: [],
  isloading: false,
  error: null,
};

// Async thunk to fetch payouts
export const fetchPayouts = createAsyncThunk<Payout[], void, { rejectValue: string }>(
  "v1/payouts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.PAYOUTS.LIST); // adjust endpoint
      console.log("Payouts api response :", response.data);
      const payouts = response.data?.data || [];
      await storage.setItem(StorageKeys.PAYOUTS_CACHE, payouts);
      return payouts;
    } catch (error: any) {
      const cached = await storage.getItem(StorageKeys.PAYOUTS_CACHE);
      if (cached) return cached;
        return rejectWithValue(error.response?.data?.message || "Failed to fetch payouts");
    }
  }
);

// Slice
const payoutSlice = createSlice({
  name: "payout",
  initialState,
  reducers: {
    clearPayouts: (state) => {
      state.payouts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayouts.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(fetchPayouts.fulfilled, (state, action: PayloadAction<Payout[]>) => {
        state.isloading = false;
        state.payouts = action.payload;
      })
      .addCase(fetchPayouts.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

// Exports
// export const { clearPayouts } = payoutSlice.actions;
// export const selectPayouts = (state: RootState) => state.payout.payouts;
// export const selectPayoutLoading = (state: RootState) => state.payout.loading;
// export const selectPayoutError = (state: RootState) => state.payout.error;

export default payoutSlice.reducer;
