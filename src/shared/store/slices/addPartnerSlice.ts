// store/addPartnerSlice.ts
import { API_ENDPOINTS } from "@/config/env";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@shared/services/api"; // Axios instance
import { ToastAndroid } from "react-native";

// For creating a partner (request body)
export interface CreatePartnerPayload {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: "active" | "inactive";
  company_name: string;
  company_type: "private" | "individual" | "silent" | "holding";
  address?: string;
  description?: string;
  initial_investment?: string;
  notes?: string;
}

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
  selectedPartner: Partner | null;
}
const initialState: partnerState = {
  partners: [],
  isLoading: false,
  error: null,
  selectedPartner: null,
};
// add partner thunk
export const addPartners = createAsyncThunk(
  "v1/admin/addPartners",
  async (newPartner: CreatePartnerPayload, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.ADMIN.PARTNERS.CREATE,
        newPartner
      );
      console.log("Add Partner response:", response.data);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      return response.data.data;
    } catch (error: any) {
      console.log("error", error.message);
      return rejectWithValue(error || "Failed to Add partner");
    }
  }
);
// fetch partners thunk
export const fetchPartners = createAsyncThunk(
  "v1/admin/partners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.PARTNERS.LIST);
      console.log("Partners api response: ", response.data);
      // ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch Partners");
    }
  }
);
// get detail partner thunk
export const fetchPartnerDetail = createAsyncThunk(
  "v1/admin/partner/detail",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.PARTNERS.DETAIL(id));
      console.log("Partner detail response:", response.data);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      return response.data.data; // ✅ directly the partner object
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch partner detail");
    }
  }
);

// Update Partner
export const updatePartner = createAsyncThunk(
  "v1/partners/update",
  async (
    { id, updatedData }: { id: number; updatedData: Partial<Partner> },
    { rejectWithValue }
  ) => {
    try {
      console.log("Update Partner called");

      // 🔹 API call
      const response = await api.put(
        API_ENDPOINTS.ADMIN.PARTNERS.UPDATE(id),
        updatedData
      );

      console.log("📦 Partner Updated:", response.data);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

      // return updated partner object
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Update failed");
    }
  }
);

const partnerSlice = createSlice({
  name: "partners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add partners thunk
      .addCase(addPartners.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPartners.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.partners=action.payload;
        state.partners.push(action.payload);
      })
      .addCase(addPartners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch partners thunk
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
      })
      // Partner details reducers
      .addCase(fetchPartnerDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPartnerDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedPartner = action.payload; // ✅ store partner detail
      })
      .addCase(fetchPartnerDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update partner reducers
      .addCase(updatePartner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePartner.fulfilled, (state, action) => {
        state.isLoading = false;
        // update the partner in the list
        state.partners = state.partners.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        );

        // also update if it's the currently selected partner
        if (state.selectedPartner?.id === action.payload.id) {
          state.selectedPartner = {
            ...state.selectedPartner,
            ...action.payload,
          };
        }
      })
      .addCase(updatePartner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});
export default partnerSlice.reducer;
