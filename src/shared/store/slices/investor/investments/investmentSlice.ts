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
  min_investment_amount: string;
  max_investment_amount: string;
  is_creator: boolean;
  is_participant: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_pause: boolean;
  can_resume: boolean;
  can_complete: boolean;
  current_total_invested: string;
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
  average_roi: number;
  total_invested: number;
  // for investments screen
  initial_amount: number;
}
export interface InvestmentPartner {
  id: number;
  investment_id: number;
  invested_amount: string;
  joined_at: string;
  status: string;
  invitation_status: string;
  participation_percentage: string;
  expected_returns: string;

  user: {
    id: number;
    name: string;
    email: string;
    first_name: string;
    last_name: string;
    status: string;
  };
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
  // Partner sub-state for modal
  partners: {
    data: InvestmentPartner[];
    isLoading: boolean;
    error: string | null;
  };
}
export interface InvestmentPartnerState {
  partners: any[];
  isLoading: boolean;
  error: string | null;
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
    average_roi: 0,
    total_invested: 0,
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
  // Partners initial state
  partners: {
    data: [],
    isLoading: false,
    error: null,
  },
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
  async (
    { page = 1, search = "" }: { page?: number; search?: string },
    { signal, rejectWithValue }
  ) => {
    try {
      const controller = new AbortController();
      signal.addEventListener("abort", () => controller.abort());

      const response = await api.get(
        `${API_ENDPOINTS.INVESTMENTS.LIST}?scope=owned&page=${page}&search=${encodeURIComponent(search)}`,
        { signal: controller.signal }
      );

      const investments = response.data?.data || [];
      const meta = response.data?.meta || {};
      const summary = response.data?.summary || {};

      await storage.setItem(StorageKeys.INVESTMENTS_CACHE, {
        investments,
        meta,
        summary,
        page,
        search,
      });

      return { investments, meta, summary, page, search };
    } catch (error: any) {
      if (signal.aborted) return;
      const cached = await storage.getItem(StorageKeys.INVESTMENTS_CACHE);
      if (cached) return cached;
      return rejectWithValue(error?.response?.data?.message || "Fetch failed");
    }
  }
);

// Fetch investment partners (for modal)
interface FetchPartnersParams {
  investmentId: number;
  status?: string; // active, withdrawn, suspended
  invitation_status?: string; // pending, accepted, declined
  search?: string; // name/email
}

export const fetchInvestmentPartners = createAsyncThunk(
  "investments/fetchPartners",
  async (
    { investmentId, status, invitation_status, search }: FetchPartnersParams,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.INVESTMENTS.INVESTMENT_PARTNERS(investmentId),
        {
          params: { status, invitation_status, search },
        }
      );
      console.log("✅ Investment partners:", response.data);
      return response.data.data as InvestmentPartner[];
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch partners"
      );
    }
  }
);

// Invite/Add Partner to an Investment
export const addInvestmentPartner = createAsyncThunk(
  "investments/addPartner",
  async (
    { investmentId, partnerData }: { investmentId: number; partnerData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.INVESTMENTS.ADD_PARTNER(investmentId),
        partnerData
      );

      console.log("✅ Partner invited:", response.data);

      ToastAndroid.show(
        response.data.message || "Partner invited successfully",
        ToastAndroid.SHORT
      );

      return response.data.data;
    } catch (error: any) {
      ToastAndroid.show(
        error?.response?.data?.message || "Failed to invite partner",
        ToastAndroid.SHORT
      );
      return rejectWithValue(error?.response?.data?.message || "Invite failed");
    }
  }
);

// Reset partners when modal closes
export const resetPartners = () => ({
  type: "investments/resetPartners",
});

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
// Approve Partner Participation
export const approveInvestmentPartner = createAsyncThunk(
  "investments/approvePartner",
  async (
    { investmentId, partnerId }: { investmentId: number; partnerId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.INVESTMENTS.APPROVE_PARTNER(investmentId, partnerId)
      );

      console.log("✅ Partner participation approved:", response.data);

      ToastAndroid.show(
        response.data?.message || "Partner participation approved",
        ToastAndroid.SHORT
      );

      return response.data.data.participant;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to approve partner";
      ToastAndroid.show(message, ToastAndroid.SHORT);
      return rejectWithValue(message);
    }
  }
);
// Remove Partner from Investment
export const removeInvestmentPartner = createAsyncThunk(
  "investments/removePartner",
  async (
    {
      investmentId,
      partnerId,
      reason = "Partner requested withdrawal",
    }: { investmentId: number; partnerId: number; reason?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.delete(
        API_ENDPOINTS.INVESTMENTS.REMOVE_PARTNER(investmentId, partnerId),
        {
          data: { reason }, // 👈 Axios supports sending a body in DELETE like this
        }
      );

      console.log("✅ Partner removed successfully:", response.data);

      ToastAndroid.show(
        response.data?.message || "Partner removed successfully",
        ToastAndroid.SHORT
      );

      return { partnerId };
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to remove partner";
      ToastAndroid.show(message, ToastAndroid.SHORT);
      return rejectWithValue(message);
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
    // ✅ Reset partners when modal is closed
    resetPartner(state) {
      state.partners = {
        data: [],
        isLoading: false,
        error: null,
      };
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
        const { page = 1 } = action.meta.arg || {};
        if (page > 1) {
          state.isLoadingMore = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        const { investments, meta, page, summary } = action.payload;

        // state.isLoading = false;
        state.meta = meta ?? {}; // full pagination meta from backend

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
        state.stats = {
          total_investments: summary?.total_investments ?? 0,
          active_investments: summary?.active_investments ?? 0,
          average_roi: summary?.average_roi ?? 0,
          total_invested: summary?.total_invested ?? 0,
          total_partners: 0, // if API adds later
          initial_amount: 0, // optional, keep for UI
        };
        state.isLoading = false;
        state.isLoadingMore = false;
      })

      .addCase(fetchInvestments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // reducers for fetching investment partners
      .addCase(fetchInvestmentPartners.pending, (state) => {
        state.partners.isLoading = true;
        state.partners.error = null;
      })
      .addCase(fetchInvestmentPartners.fulfilled, (state, action) => {
        state.partners.isLoading = false;
        state.partners.data = action.payload;
      })
      .addCase(fetchInvestmentPartners.rejected, (state, action) => {
        state.partners.isLoading = false;
        state.partners.error = action.payload as string;
      })
      // ✅ Add Partner Reducers
      .addCase(addInvestmentPartner.pending, (state) => {
        state.partners.isLoading = true;
        state.partners.error = null;
      })
      .addCase(addInvestmentPartner.fulfilled, (state, action) => {
        state.partners.isLoading = false;

        // ✅ Prepend the new partner to the list
        state.partners.data = [action.payload, ...state.partners.data];
      })
      .addCase(addInvestmentPartner.rejected, (state, action) => {
        state.partners.isLoading = false;
        state.partners.error = action.payload as string;
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
      })
      // Approve partner participation
      .addCase(approveInvestmentPartner.pending, (state) => {
        state.partners.isLoading = true;
        state.partners.error = null;
      })
      .addCase(approveInvestmentPartner.fulfilled, (state, action) => {
        state.partners.isLoading = false;

        const approvedPartner = action.payload;

        // Update partner status in existing list
        state.partners.data = state.partners.data.map((partner) =>
          partner.id === approvedPartner.id
            ? { ...partner, ...approvedPartner }
            : partner
        );

        // Optionally also update investment stats or details if needed later
      })
      .addCase(approveInvestmentPartner.rejected, (state, action) => {
        state.partners.isLoading = false;
        state.partners.error = action.payload as string;
      })
      // Remove partner participation
      .addCase(removeInvestmentPartner.pending, (state) => {
        state.partners.isLoading = true;
        state.partners.error = null;
      })
      .addCase(removeInvestmentPartner.fulfilled, (state, action) => {
        state.partners.isLoading = false;

        const { partnerId } = action.payload;

        // Remove partner from state
        state.partners.data = state.partners.data.filter(
          (partner) => partner.id !== partnerId
        );
      })
      .addCase(removeInvestmentPartner.rejected, (state, action) => {
        state.partners.isLoading = false;
        state.partners.error = action.payload as string;
      });
  },
});
export const { resetInvestments, resetPartner } = investmentSlice.actions;
export default investmentSlice.reducer;
