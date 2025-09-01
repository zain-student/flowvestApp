// store/addPartnerSlice.ts
import { API_ENDPOINTS } from "@/config/env";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@shared/services/api"; // Axios instance
import { ToastAndroid } from "react-native";
export interface Company {
  id: number;
  name: string;
  phone?: string | null;
  address?: string | null;
  description?: string | null;
  settings: Record<string, any>;
}
export interface Partner {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  preferences?: { notes?: string };
  company?: Company;
  total_invested?: number;
  active_investments?: number;
  total_earned?: number;
  roi_percentage?: number;
  status?: "active" | "inactive";
  joined_date?: string;
  last_activity?: string;
  created_at?: string;
  updated_at?: string;
}
interface partnerState {
  partners: Partner[];
  isLoading: boolean;
  error: string | null;
}
const initialState: partnerState = {
  partners: [],
  isLoading: false,
  error: null,
};

export const fetchPartners = createAsyncThunk(
  "v1/admin/partners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.PARTNERS.LIST);
      console.log("Partners api response: ", response.data);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch Partners");
    }
  }
);

const partnerSlice = createSlice({
  name: "partners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartners.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.partners = action.payload.data.partners;
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});
export default partnerSlice.reducer;
