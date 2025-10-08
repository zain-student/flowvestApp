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
// Partner Investments type interface
export interface Investment {
  id: number;
  title: string;
  amount_invested: string;
  current_value: string;
  roi_percentage: number;
  status: "active" | "completed";
  start_date: string;
}

export interface InvestmentSummary {
  total_invested: number;
  total_current_value: number;
  total_roi: number;
}
// Partner Payouts type interface
export interface Payouts {
  id: number;
  amount: string;
  method: string;
  status: "paid" | "pending";
  date: string;
}
export interface PayoutSummary {
  total_paid: number;
  pending_amount: number;
  total_payouts: number;
}
// Partner Performance type interface
export interface PartnerPerformanceOverview {
  total_invested: string; // comes as string "10000.00"
  current_portfolio_value: number;
  total_earned: number;
  overall_roi: number;
  active_investments: number;
}

export interface PartnerMonthlyPerformance {
  month: string; // e.g. "2025-08"
  investment_amount: number | string; // can be "10000.00" or 0
  earnings: number;
  roi: number;
}

export interface PartnerInvestmentBreakdown {
  investment_type: string;
  amount: number;
  percentage: number;
  roi: number;
}

export interface PartnerPerformanceData {
  overview: PartnerPerformanceOverview;
  monthly_performance: PartnerMonthlyPerformance[];
  investment_breakdown: PartnerInvestmentBreakdown[];
}

interface partnerState {
  partners: Partner[];
  isLoading: boolean;
  error: string | null;
  selectedPartner: Partner | null;
  // For partner investments
  investments: Investment[];
  investmentSummary: InvestmentSummary | null;
  // For partner payouts
  payouts: Payouts[];
  payoutSummary: PayoutSummary | null;
  // For partner performance
  performance: PartnerPerformanceData | null;
}
const initialState: partnerState = {
  partners: [],
  isLoading: false,
  error: null,
  selectedPartner: null,
  investments: [],
  investmentSummary: null,
  payouts: [],
  payoutSummary: null,
  performance: null,
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

// Update Partner thunk
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
// Partners investments thunk
export const fetchPartnerInvestments = createAsyncThunk(
  "v1/admin/partner/investments",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.ADMIN.PARTNERS.INVESTMENTS(id)
      );
      console.log("Partner investments response:", response.data.data);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      return response.data.data; // ✅ directly the partner object
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch partner investments"
      );
    }
  }
);
// Partners Payouts thunk
export const fetchPartnerPayouts = createAsyncThunk(
  "v1/admin/partner/payouts",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.PARTNERS.PAYOUTS(id));
      console.log("Partner payouts response:", response.data.data);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      return response.data.data; // ✅ directly the partner object
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch partner payouts"
      );
    }
  }
);
// Partner Performance thunk
export const fetchPartnerPerformance = createAsyncThunk(
  "v1/admin/partner/performance",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.ADMIN.PARTNERS.PERFORMANCE(id)
      );
      console.log("Partner performance response:", response.data.data);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      return response.data.data; // ✅ directly performance data
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch partner performance"
      );
    }
  }
);
// Invite Partner to Investment Thunk
export const invitePartnerToInvestment = createAsyncThunk(
  "v1/investments/partners/invite",
  async (
    {
      investmentId,
      partnerId,
      investedAmount,
      investmentNotes,
      invitationMessage,
      minExperience,
    }: {
      investmentId: number;
      partnerId: number;
      investedAmount: number;
      investmentNotes: string;
      invitationMessage: string;
      minExperience: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.INVESTMENTS.ADD_PARTNER(investmentId),
        {
          partner_id: partnerId,
          invested_amount: investedAmount,
          investment_notes: investmentNotes,
          invitation_message: invitationMessage,
          requirements: {
            min_experience: minExperience,
          },
        }
      );

      console.log("✅ Invite Partner Response:", response.data);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      return response.data.data;
    } catch (error: any) {
      console.log("❌ Invite Partner Error:", error);
      return rejectWithValue(
        error.message || "Failed to invite partner"
      );
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
      })
      // Partner investments reducers
      .addCase(fetchPartnerInvestments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPartnerInvestments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.investments = action.payload.investments; // ✅ store partner investments
        state.investmentSummary = action.payload.summary;
      })
      .addCase(fetchPartnerInvestments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Partner payout reducers
      .addCase(fetchPartnerPayouts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPartnerPayouts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payouts = action.payload.payouts; // ✅ store partner investments
        state.payoutSummary = action.payload.summary;
      })
      .addCase(fetchPartnerPayouts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Partner Performance reducers
      .addCase(fetchPartnerPerformance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPartnerPerformance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.performance = action.payload; // ✅ store partner performance
      })
      .addCase(fetchPartnerPerformance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Reducers for app partner
      .addCase(invitePartnerToInvestment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(invitePartnerToInvestment.fulfilled, (state) => {
        state.isLoading = false;
        // ToastAndroid.show("Partner invited successfully!", ToastAndroid.SHORT);
      })
      .addCase(invitePartnerToInvestment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        ToastAndroid.show(
          state.error || "Failed to invite partner",
          ToastAndroid.SHORT
        );
      });
  },
});
export default partnerSlice.reducer;
